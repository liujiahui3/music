<template>
<div>
  <div class="recommend wrapper"
       ref="scroll">
    <div class="content">
      <!-- 发送数据到banner组件 -->
      <banner :banners="dataList"></banner>
      <h2>热门歌单推荐</h2>
      <songlist :isrefresh="isrefresh"></songlist>
    </div>
  </div>
  <router-view></router-view>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import banner from '../components/banner'
import songlist from './recommend/songList'
import { getBannerData } from '../api/api'
import { Indicator } from 'mint-ui'
export default {
  components: {
    banner,
    songlist
  },
  data () {
    return {
      dataList: [],
      isrefresh: false
    }
  },
  mounted () {
    this.BSinit()
    // 如果本地存储有数据就使用本地
    if (sessionStorage.getItem('bannerUrl')) {
      this.dataList = JSON.parse(sessionStorage.getItem('bannerUrl'))
    } else {
      // 请求轮播图数据
      getBannerData()
        .then(data => {
          this.dataList = data.data.data.slider
          // 将数据存入本地存储
          sessionStorage.setItem('bannerUrl', JSON.stringify(this.dataList))
        })
        .catch(err => {
          console.log(err)
        })
    }
    this.bs.on('pullingDown', () => {
      this.isrefresh = !this.isrefresh
      // 显示加载中图标
      Indicator.open()
      this.bs.finishPullDown()
      this.refreshData()
    })
  },
  methods: {
    // better-scroll初始化
    BSinit () {
      const wrapper = this.$refs.scroll
      this.bs = new BScroll(wrapper, {
        click: true,
        pullDownRefresh: {
          threshold: 50,
          stop: 20
        },
        pullUpLoad: {
          threshold: 50
        }
      })
    },
    refreshData () {
    // 请求轮播图数据
      getBannerData()
        .then(data => {
          this.dataList = data.data.data.slider
          // 关闭加载中图标
          Indicator.close()
          // 将数据存入本地存储
          sessionStorage.setItem('bannerUrl', JSON.stringify(this.dataList))
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style";
h2 {
  @include h(65);
  line-height: 65rem * $rem;
  text-align: center;
  color: #f2c331;
  font-size: $fs-s;
  font-weight: 500;
}
.recommend {
  background: $black2;
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
