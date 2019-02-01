<template>
  <el-row>
    <el-col :span="18">
      <img class="avatar" :src="item.author.avatar_url">
      <div class="up-read">
        <span class="up">{{item.reply_count}}</span>
        <span class="read">/{{item.visit_count}}</span>
      </div>
      <el-tag type="success" size="small" v-if="item.good">精华</el-tag>
      <p class="title">
        <nuxt-link :to="'/topic/'+item.id">{{item.title}}</nuxt-link>
      </p>
    </el-col>
    <el-col :span="6" class="right">
      <!-- <img class="replier" src="https://avatars0.githubusercontent.com/u/376338?v=4&s=120"> -->
      <p class="date">{{item.create_at |getLastTimeStr(true)}}</p>
    </el-col>
  </el-row>
</template>

<script>
import moment from 'moment'
export default {
  props: ['item'],
  data() {
    return {}
  },

  components: {}
}
</script>

<style scoped>
.el-row {
  background-color: #f6f6f6;
  padding: 30px;
  border-bottom: solid 1px #e6e6e6;
}
.avatar {
  width: 30px;
  height: 30px;
  vertical-align: middle;
  border-radius: 30px;
  margin-right: 20px;
}
.up-read {
  display: inline-block;
  margin-right: 20px;
}
.up {
  color: #9e78c0;
}
.read {
  color: #b4b4b4;
  font-size: 10px;
}
.title {
  display: inline-block;
  color: #888;
  margin-left: 5px;
}
.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.replier {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  border-radius: 18px;
  margin-right: 10px;
}
.date {
  text-align: right;
  min-width: 50px;
  display: inline-block;
  white-space: nowrap;
}
</style>
