<template>
  <div>
    <vItem v-for="item in list" :key="item.id" :item="item" style="margin: 0px;"></vItem>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="1000">
    </el-pagination>
  </div>
</template>

<script>
import vItem from '@/components/item'
export default {
  props: ['list'],
  data() {
    return {}
  },
  components: {
    vItem
  }
}
</script>

<style scoped>
.el-pagination{
  background-color: #f6f6f6;
  padding: 30px;
}
</style>
