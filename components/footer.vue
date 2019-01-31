<template>
  <div class="footer">
    <div class="links">
      <a class="dark" href="/rss">RSS</a>
      |
      <a class="dark" href="https://github.com/cnodejs/egg-cnode/">源码地址</a>
    </div>
    <vSponsors/>
  </div>
</template>

<script>
import vSponsors from './_sponsors.vue'

export default {
  data() {
    return {}
  },
  components: {
    vSponsors
  }
}
</script>
<style scoped>
.footer {
  margin: 10px 0 30px 0;
}
.dark {
  color: #000;
  text-decoration: none;
}
</style>

