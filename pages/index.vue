<template>
  <el-container class="home">
    <el-main style="padding: 10px 0;">
      <el-header>
        <el-radio-group v-model="tab">
          <el-radio-button v-for="item in tabs" :key="item.tab" :label="item.tab">{{item.text}}</el-radio-button>
        </el-radio-group>
      </el-header>
      <vList :list="list"/>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        :current-page="page"
        @current-change="currentChange"
      ></el-pagination>
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
    let { tab, page } = query
    const res = await getTopics(page, tab)
    return { list: res.data }
  },
  created() {
    // this.getTopics()
  },
  data() {
    return {
      tabs: [
        { text: '全部', tab: 'all' },
        { text: '精华', tab: 'good' },
        { text: '分享', tab: 'share' },
        { text: '问答', tab: 'ask' },
        { text: '招聘', tab: 'job' },
        { text: '客户端测试', tab: 'dev' }
      ],
      loading: false,
      tab: this.$route.query.tab || 'all',
      page: Number(this.$route.query.page) || 1,
      list: []
    }
  },
  components: {
    vList
  },
  methods: {
    currentChange(page) {
      this.page = page
    }
  },
  watch: {
    async tab(newVal) {
      // 避免发送多次请求
      if (this.page === 1) {
        const { data } = await getTopics(this.page, this.tab)
        this.list = data
      } else {
        this.page = 1
      }
    },
    async page(newVal) {
      const { data } = await getTopics(this.page, this.tab)
      this.list = data
    }
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
.el-pagination {
  background-color: #f6f6f6;
  padding: 30px;
}
</style>
