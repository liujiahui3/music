<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide"
           v-for="item in banners"
           :key="item.id"
           :ref="item.id">
        <img :src="item.picUrl"
             alt="" />
      </div>
    </div>
    <!-- 分页器 -->
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
import Swiper from 'swiper'
export default {
  // 轮播图数据,
  props: { banners: { type: Array, default: () => [] } },
  methods: {
    // swiper初始化
    initSwiper () {
      // eslint-disable-next-line no-new
      new Swiper('.swiper-container', {
        pagination: {
          // 分页器
          el: '.swiper-pagination'
        }, // 循环播放
        loop: true,
        // 自动轮播
        autoplay: true
      })
    }
  },
  watch: {
    banners (newValue, oldValue) {
      this.$nextTick(() => {
        this.initSwiper()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style";
@import "~swiper/css/swiper.min.css";
.swiper-container {
  img {
    //  @include h(150)
    height: 150rem * $rem;
  }
  @include h(150);
}
</style>
