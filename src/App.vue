<template>
  <div id="app">
    <headerMucis></headerMucis>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <playing></playing>
  </div>
</template>

<script>
import headerMucis from './views/header'
import playing from '@/components/playing'
export default {
  components: {
    headerMucis,
    playing
  }
}
</script>

<style lang="scss">
@import "./style";
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
.nav {
  position: fixed;
  top: 0;
  left: 0;
}
#app {
  padding-top: 88px;
  background: $black2;
}
html{
touch-action:none;
touch-action:pan-y;
}
</style>
