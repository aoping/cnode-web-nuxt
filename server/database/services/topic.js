import mongoose from 'mongoose'
import {
  getUserById
} from './user'
import {
  getReplyById,
  getRepliesByTopicId,
  getLastReplyByTopId,
} from './reply'
import {
  linkUsers
} from './at'
const qiniu = require('qiniu')
const Topic = mongoose.model('Topic')
const User = mongoose.model('User')

/*
 * 根据关键词，获取主题列表
 * @param {String} query 搜索关键词
 * @param {Object} opt 搜索选项
 */
export async function getTopicsByQuery(query, opt) {
  query.deleted = false
  const topics = await Topic.find(query, {}, opt).exec()

  if (topics.length === 0) {
    return []
  }

  await Promise.all(
    topics.map(async topic => {
      const [author, reply] = await Promise.all([
        getUserById(topic.author_id),
        // 获取主题的最后回复
        getReplyById(topic.last_reply),
      ])
      topic.author = author
      topic.reply = reply
    })
  )

  return topics.filter(item => {
    // 删除不合规的 topic
    return !!item.author
  })
}

/*
 * 根据主题ID获取主题
 * @param {String} id 主题ID
 */
export async function getTopicById(id) {
  const topic = await Topic.findOne({
    _id: id
  }).exec()
  if (!topic) {
    return {
      topic: null,
      author: null,
      last_reply: null,
    }
  }

  const author = await getUserById(topic.author_id)

  let last_reply = null
  if (topic.last_reply) {
    last_reply = await getReplyById(topic.last_reply)
  }

  return {
    topic,
    author,
    last_reply,
  }
}

/*
 * 获取关键词能搜索到的主题数量
 * @param {String} query 搜索关键词
 */
export function getCountByQuery(query) {
  return Topic.count(query).exec()
}

// for sitemap
export function getLimit5w() {
  const query = {
    deleted: false
  }
  const opts = {
    limit: 50000,
    sort: '-create_at'
  }
  return Topic.find(query, '_id', opts).exec()
}

/*
 * 获取所有信息的主题
 * Callback:
 * - err, 数据库异常
 * - message, 消息
 * - topic, 主题
 * - author, 主题作者
 * - replies, 主题的回复
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
export async function getFullTopic(id) {
  const query = {
    _id: id,
    deleted: false
  }
  const topic = await Topic.findOne(query)

  if (!topic) {
    // throw new Error('此话题不存在或已被删除。')
    return []
  }

  topic.linkedContent = linkUsers(topic.content)

  const author = await getUserById(topic.author_id)
  if (!author) {
    // throw new Error('话题的作者丢了。')
    return []
  }

  const replies = await getRepliesByTopicId(topic._id)
  return [topic, author, replies]
}

/*
 * 更新主题的最后回复信息
 * @param {String} topicId 主题ID
 * @param {String} replyId 回复ID
 * @param {Function} callback 回调函数
 */
export function updateLastReply(topicId, replyId) {
  const update = {
    last_reply: replyId,
    last_reply_at: new Date(),
    $inc: {
      reply_count: 1,
    },
  }
  const opts = {
    new: true
  }
  return Topic.findByIdAndUpdate(topicId, update, opts).exec()
}

/*
 * 根据主题ID，查找一条主题
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
export function getTopic(id) {
  return Topic.findOne({
    _id: id
  }).exec()
}

/*
 * 将当前主题的回复计数减1，并且更新最后回复的用户，删除回复时用到
 * @param {String} id 主题ID
 */
export async function reduceCount(id) {
  const update = {
    $inc: {
      reply_count: -1
    }
  }
  const reply = await getLastReplyByTopId(id)
  if (reply) {
    update.last_reply = reply._id
  } else {
    update.last_reply = null
  }
  const opts = {
    new: true
  }

  const topic = await Topic.findByIdAndUpdate(id, update, opts).exec()
  if (!topic) {
    throw new Error('该主题不存在')
  }

  return topic
}

export function incrementVisitCount(id) {
  const query = {
    _id: id
  }
  const update = {
    $inc: {
      visit_count: 1
    }
  }
  return Topic.findByIdAndUpdate(query, update).exec()
}

export function incrementCollectCount(id) {
  const query = {
    _id: id
  }
  const update = {
    $inc: {
      collect_count: 1
    }
  }
  return Topic.findByIdAndUpdate(query, update).exec()
}

export function newAndSave(title, content, tab, authorId) {
  const topic = new Topic()
  topic.title = title
  topic.content = content
  topic.tab = tab
  topic.author_id = authorId

  return topic.save()
}

/*
 * 七牛上传
 * @param {Stream} readableStream 流
 * @param {String} key 文件名key
 * @param {Function} callback 回调函数
 */
export function qnUpload(readableStream, key) {
  const {
    accessKey,
    secretKey,
    bucket
  } = this.config.qn_access

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket
  })
  const uploadToken = putPolicy.uploadToken(mac)

  const config = new qiniu.conf.Config()
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()

  return new Promise(function (resolve, reject) {
    formUploader.putStream(uploadToken, key, readableStream, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        reject(respErr)
        return
      }
      if (respInfo.statusCode === 200) {
        resolve(respBody)
      } else {
        reject(new Error('上传失败:statusCode !== 200'))
      }
    })
  })
}
