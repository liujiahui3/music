<template>
  <div class="nav">
    <headerTitle></headerTitle>
    <navbar></navbar>
  </div>
</template>
<script>
import headerTitle from './header/title'
import navbar from './header/navbar'
export default {
  components: {
    headerTitle,
    navbar
  }
}
</script>
<style lang="scss" scoped>
.nav{
  width: 100%;
  height: 88px;
  background: #222222;
  color: #f2c331;
  z-index: 102;
}
</style>
