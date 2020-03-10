<template>
  <div>
    <ul>
      <li>
        <router-link to="recommend" tag="span" active-class="now"
          >推荐</router-link
        >
      </li>
      <li>
        <router-link to="singer" tag="span" active-class="now"
          >歌手</router-link
        >
      </li>
      <li>
        <router-link to="rank" tag="span" active-class="now">排行</router-link>
      </li>
      <li>
        <router-link to="search" tag="span" active-class="now"
          >搜索</router-link
        >
      </li>
    </ul>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
@import '../../style';
ul {
  font-size: $fs-s;
  display: flex;
  justify-content: space-around;
  li {
    flex: 1;
    text-align: center;
    color: #919191;
  }
  span {
    padding-bottom: 5px;
    line-height: 44px;
  }
  .now {
    color: #f2c331;
    border-bottom: 2px solid #f2c331;
  }
}
</style>
