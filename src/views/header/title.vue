<template>
  <div class="top">
    <h1>Music</h1>
    <span class="iconfont icon-wode" @click="toUser()"> </span>
  </div>
</template>
<script>
export default {
  methods: {
    toUser () {
      this.$router.push('/user')
    }
  }
}
</script>
<style lang="scss" scoped>
.top {
  position: relative;
  height: 40px;
  h1 {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
  span {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
