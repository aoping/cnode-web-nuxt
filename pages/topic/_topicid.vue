<template>
  <el-container class="home">
    <el-main style="padding: 10px 0;word-wrap: break-word;">
      <el-header>
        <el-tag type="success" size="small" v-if="topic.top">置顶</el-tag>
        <p class="title">{{topic.title}}</p>
        <p
          class="desc"
        >发布于{{topic.create_at|getLastTimeStr(true)}} · 作者 {{topic.author.loginname}} · {{topic.visit_count}}次浏览 ·来自 {{tabFormat(topic.tab)}}</p>
      </el-header>
      <el-main v-html="topic.content"></el-main>
      <el-main>
        <el-header>
          {{topic.reply_count}}条回复
          <a class="replyto" @click.prevent="replyHandler">回复</a>
        </el-header>
        <Markdown v-show="markdownSign" ref="markdown" :height="100" @commitValue="commitValue"/>
        <div v-for="reply in topic.replies" :key="reply.id">
          <ReplyItem :reply="reply"/>
        </div>
      </el-main>
    </el-main>
    <el-aside width="400px" style="padding: 10px 0;margin-left: 50px;">
      <TopicAside :topicUser="topicUser"/>
    </el-aside>
  </el-container>
</template>

<script>
import { getTopicDetail, getUser } from '@/api'
import config from '@/config'
import ReplyItem from '@/components/replyItem'
import Markdown from '@/components/markdown'
import TopicAside from '@/components/topicAside'
export default {
  async asyncData({ params }) {
    const res = await getTopicDetail(params.topicid)
    console.log(res)
    let topicUser = {}
    if (res.success) {
      const r = await getUser(res.data.author.loginname)
      if (r.success) topicUser = r.data
    }
    return { topic: res.data, topicUser }
  },
  created() {
    // this.getTopics()
  },
  data() {
    return {
      topic: null,
      markdownSign: false
    }
  },
  components: {
    ReplyItem,
    Markdown,
    TopicAside
  },
  methods: {
    tabFormat(tab) {
      return config.tabs[tab]
    },
    replyHandler() {
      this.markdownSign = !this.markdownSign
    },
    commitValue(val) {
      console.log(val)
    }
  },
  watch: {}
}
</script>

<style scoped>
.el-header {
  line-height: 60px;
  background-color: #f6f6f6;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: solid 1px #e6e6e6;
}
.title {
  margin: 0;
  display: inline-block;
  margin-left: 20px;
}
.desc {
  display: inline-block;
  margin: 0;
  color: #838383;
  font-size: 12px;
  line-height: 20px;
}
.replyto {
  float: right;
  color: #08c;
}
@media screen and (max-width: 980px) {
  .el-aside {
    display: none;
  }
}
</style>
