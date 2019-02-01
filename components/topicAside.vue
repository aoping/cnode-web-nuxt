<template>
  <div>
    <div class="usefinfo">
      <p class="title">作者</p>
      <el-row class>
        <img class="avatar" :src="topicUser.avatar_url">
        <span>{{topicUser.loginname}}</span>
      </el-row>
      <p class="score">积分：{{topicUser.score}}</p>
      <div class="line"></div>
      <p class="title">作者其它话题</p>
      <ul class="list">
        <li class="link-topic" v-for="(item,index) in topicUser.recent_topics" :key="item.id">
          <nuxt-link :to="'/topic/'+item.id">
            <p>{{index+1}}. {{item.title}}</p>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['topicUser'],
  data() {
    return {}
  },
  components: {}
}
</script>

<style scoped>
.usefinfo {
  background-color: #f6f6f6;
  border-radius: 5px;
  padding: 0 20px 20px 20px;
}
.title {
  margin: 0;
  line-height: 60px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  vertical-align: middle;
  margin-right: 10px;
}
.score {
  margin-top: 10px;
}
.line {
  height: 1px;
  background-color: #e0e6ed;
  margin: 5px -20px;
}
.list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.link-topic {
  overflow: hidden;
}
.link-topic a {
  color: #000;
  text-decoration: none;
}
.link-topic a p {
  margin: 0;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
