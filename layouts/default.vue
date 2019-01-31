<template>
  <el-container>
    <el-header>
      <vNav/>
    </el-header>
    <el-main>
      <nuxt/>
    </el-main>
    <el-footer>
      <vFooter/>
    </el-footer>
  </el-container>
</template>

<script>
import vNav from '../components/nav.vue'
import vFooter from '../components/footer.vue'

export default {
  components: {
    vNav,
    vFooter
  }
}
</script>
<style scoped>
</style>
