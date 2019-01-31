<template>
  <div>
    <vItem v-for="item in list" :key="item.id" :item="item" style="margin: 0px;"></vItem>
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
</style>
