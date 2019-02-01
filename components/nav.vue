<template>
  <el-row :gutter="10" justify="space-between" class="nav">
    <el-col :span="8">
      <el-input placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-col>
    <el-col :span="16">
      <el-menu :default-active="activeIndex" class="menu" mode="horizontal">
        <el-menu-item
          v-for="(menu, index) in menus"
          v-if="menu.login === undefined ||  menu.login === isLogin"
          @click="switchMenu(index)"
          :key="menu.text"
          :index="menu.path"
        >{{ menu.text }}</el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      searchValue: '',
      activeIndex: '/',
      isLogin: false,
      menus: [
        { text: '首页', path: '/' },
        { text: '未读消息', path: '/user/messages', login: true },
        // { text: '新手入门', path: '' },
        // { text: 'API', path: '' },
        // { text: '关于', path: '' },
        // { text: '注册', path: '', login: false },
        { text: '登录', path: '/login', login: false },
        { text: '设置', path: '', login: true },
        { text: '退出', handler: 'loginOut', login: true }
      ]
    }
  },
  methods: {
    switchMenu(index) {
      let { path, handler } = this.menus[index]
      if (path) {
        this.$router.push(path)
        return
      }
      if (handler) {
        this[handler]()
      }
    }
  }
}
</script>

<style scoped>
.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.menu {
  float: right;
}
</style>
