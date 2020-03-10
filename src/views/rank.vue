<template>
<div>
  <div class="rank">
    <div class="wrapper"
         ref="wrapper">
      <ul class="content">
        <li v-for="item in songList"
            :key="item.id"
            @click="toDetail(item.id,item.picUrl)">
          <img :src="item.picUrl"
               alt="">
          <div class="right">
            <div v-for="(data,SIndex) in item.songList"
                 :key="SIndex">
              <span>{{SIndex}}</span>
              <h2>{{data.songname}}-{{data.singername}}</h2>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { getRankList } from '@/api/api'
import BS from 'better-scroll'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      songList: []
    }
  },
  computed: {
    ...mapState(['fullScreen'])
  },
  mounted () {
    // 发请求获取排行数据
    getRankList().then((res) => {
      this.songList = res.data.data.topList
    }).catch((err) => {
      console.log(err)
    })
    // 初始化better-scroll
    this.bsInit()
  },
  activated () {
    // 如果播放器存在,则显示区域缩小60像素
    if (!this.fullScreen) {
      this.$refs.wrapper.style.bottom = '60px'
    }
  },
  methods: {
    toDetail (id, bgUrl) {
      const url = `/rank/detail?id=${id}&type=rank&bgurl=${bgUrl}`
      this.$router.push(url)
    },
    bsInit () {
      this.$nextTick(() => {
        const wrap = this.$refs.wrapper
        this.bs = new BS(wrap, { click: true })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~../style";
.wrapper {
  position: fixed;
  top: 88px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  li {
    padding: 20px 20px 0;
    height: 100px;
    display: flex;
    img {
      width: 100px;
      height: 100px;
    }
    .right {
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #333;
      @include w(195);
      font-size: $fs-xs;
      color: hsla(0, 0%, 100%, 0.3);
      line-height: 26px;
      h2 {
        font-size: $fs-xs;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      div {
        height: 26px;
        display: flex;
      }
    }
  }
}
.rank {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: $black2;
}
</style>
