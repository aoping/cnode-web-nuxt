<template>
  <el-row class="reply">
    <el-col :span="2">
      <img class="avatar" :src="reply.author.avatar_url">
    </el-col>
    <el-col :span="18">
      <div>
        {{reply.author.loginname}}
        <span class="floor">2楼·{{reply.create_at|getLastTimeStr(true)}}</span>
      </div>
      <p class="content" v-html="reply.content"></p>
    </el-col>
    <el-col :span="4" class="options">
      <i class="iconfont icon-custom-praise"></i>
      <span class="ups">{{reply.ups.length>0?reply.ups.length:''}}</span>
      <i class="iconfont icon-reply"></i>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['reply'],
  data() {
    return {}
  },
  components: {}
}
</script>

<style scoped>
.reply {
  padding: 20px;
  border-bottom: solid 1px #e6e6e6;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 60px;
}
.floor {
  margin-left: 10px;
  color: #08c;
}
.options {
  text-align: right;
}
.ups {
  margin-right: 10px;
}
</style>
<style>
.content img {
  max-width: 100%;
}
</style>

