<template>
  <el-container class="home">
    <el-main style="padding: 10px 0;">
      <el-header>
        <el-radio-group v-model="tab">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="good">精华</el-radio-button>
          <el-radio-button label="share">分享</el-radio-button>
          <el-radio-button label="ask">问答</el-radio-button>
          <el-radio-button label="job">招聘</el-radio-button>
          <el-radio-button label="dev">客户端测试</el-radio-button>
        </el-radio-group>
      </el-header>
      <vList :list="list"/>
    </el-main>
    <el-aside width="300px">Aside</el-aside>
  </el-container>
</template>

<script>
import vList from '@/components/list'
import { getTopics } from '@/api'
import config from '@/config'
// import axios from '@/plugins/axios'
export default {
  async asyncData({ query }) {
    const res = await getTopics(1, 'all')
    return { list: res.data }
  },
  created() {
    // this.getTopics()
  },
  data() {
    return {
      loading: false,
      tab: 'all',
      page: 1,
      list: []
    }
  },
  components: {
    vList
  },
  methods: {
    // async getTopics() {
    //   this.loading = true
    //   const result = await getTopics(this.page, this.tab)
    //   if (result.success) {
    //     this.list = result.data
    //   }
    //   this.loading = false
    // }
  }
}
</script>

<style scoped>
.home {
  /* background-color: #e0e6ed; */
}
.main {
  background-color: #fff;
  border-radius: 5px;
}
.el-header {
  line-height: 60px;
  background-color: #f6f6f6;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: solid 1px #e6e6e6;
}
</style>
