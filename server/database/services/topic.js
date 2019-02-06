import mongoose from 'mongoose'
import {
  getUserById
} from './user'
import {
  getReplyById
} from './reply'
const Topic = mongoose.model('Topic')
const User = mongoose.model('User')

/*
 * 根据关键词，获取主题列表
 * @param {String} query 搜索关键词
 * @param {Object} opt 搜索选项
 */
export async function getTopicsByQuery(query, opt) {
  query.deleted = false;
  const topics = await Topic.find(query, {}, opt).exec();

  if (topics.length === 0) {
    return [];
  }

  await Promise.all(
    topics.map(async topic => {
      const [author, reply] = await Promise.all([
        getUserById(topic.author_id),
        // 获取主题的最后回复
        getReplyById(topic.last_reply),
      ]);
      topic.author = author;
      topic.reply = reply;
    })
  );

  return topics.filter(item => {
    // 删除不合规的 topic
    return !!item.author;
  });
}
