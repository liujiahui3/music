<template>
  <div class="play"
       v-if="songer.length"
       @touchmove.prevent="">
    <div class="big"
         v-if="fullScreen">
      <div class="back">
        <!-- 返回 -->
        <span class="iconfont icon-shangyiye"
              @click="changeFullScreen(false)"></span>
        <!-- 歌曲 -->
        <h2>{{songer[nowIndex].songname}} </h2>
      </div>
      <!-- 歌手 -->
      <h3>{{songer[nowIndex].singer[0].name}}</h3>
      <div class="img"
           ref="cd">
        <img :src="imgUrl"
             alt="">
      </div>
      <!-- 背景 -->
      <div class="bg" @click.prevent="">
        <img :src="imgUrl"
             alt=""></div>
      <!-- 歌词 -->
      <lyric :startTime="startTime"
             :play="play"
             :changeTime="changeTime"></lyric>
      <!-- 进度条 -->
      <my-progress :enTime="enTime"
                   :startTime="startTime"
                   @mySeek="mySeek"></my-progress>
      <!-- 控制器 -->
      <div class="controller">
        <span @click="changeLoop">{{loops[loop-1]}}</span>
        <span class="iconfont icon-shangyishou"
              @click="prev"></span>
        <span :class="play?'iconfont icon-zanting':'iconfont icon-bofang'"
              @click="play = !play"></span>
        <span class="iconfont icon-49xiayishou"
              @click="next"></span>
        <span :class="'iconfont icon-love-b '+(isLike?'red':'yellow')" @click="like"></span>
      </div>
    </div>
    <div class="small"
         v-else
         @click="toBig">
      <div class="smallImg"
           ref="smallCd">
        <img :src="imgUrl"
             alt="">
      </div>
      <div class="songMes">
        <div class="songName">{{songer[nowIndex].songname}}</div>
        <div class="singerName">{{songer[0].singer[0].name}}</div>
      </div>
      <div class="playWarp">
        <span :class="play?'iconfont icon-zanting':'iconfont icon-bofang'"
              @click.stop="play = !play"></span>
      </div>
    </div>
    <!-- 播放器 -->
    <audio :src="songer[nowIndex].aduioUrl"
           ref="aduio"
           @canplay="canplay"
           @ended="ended"
           @timeupdate="timeUpdata"></audio>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import myProgress from './progress'
import { Toast } from 'mint-ui'
import lyric from './lyric'
export default {
  components: {
    myProgress, lyric
  },
  data () {
    return {
      loops: ['单曲', '列表', '随机'],
      play: true,
      enTime: 0,
      startTime: 0,
      changeTime: 0,
      isLike: false
    }
  },
  computed: {
    ...mapState(['songer', 'nowIndex', 'fullScreen', 'loop']),
    imgUrl () {
      // 图片地址
      if (this.songer[this.nowIndex].albummid) {
        return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.songer[this.nowIndex].albummid}.jpg?max_age=2592000`
      } else {
        return 'http://p1.music.126.net/iaNMfCRTZ34fP0MjY9rOjg==/7898891534959085.jpg?param=300y300'
      }
    }
  },
  methods: {
    ...mapMutations(['changeFullScreen', 'changeLoop', 'changeNowIndex', 'nextSong', 'prevSong', 'changeFullScreen']),
    toBig () {
      this.changeFullScreen(true)
    },
    mySeek (ratio) {
      // 改变歌曲当前的播放时间
      this.aduio.currentTime = this.enTime * ratio
      // 改变歌曲播放时间是将当前时间传给歌词组件
      this.changeTime = this.aduio.currentTime
      this.play = true
    },
    timeUpdata (e) {
      // 歌曲当前时间
      this.startTime = e.target.currentTime
    },
    next () {
      // 下一首
      this.nextSong()
      this.play = true
    },
    prev () {
      // 上一首
      this.prevSong()
      this.play = true
    },
    canplay () {
      // 音乐准备就绪
      this.aduio = this.$refs.aduio
      this.enTime = this.aduio.duration
      this.aduio.play()
    },
    ended () {
      // 音乐播放模式
      const renNum = parseInt(Math.random() * (this.songer.length - 1))
      switch (this.loop) {
        // 单曲循环
        case 1: this.aduio.play(); break
        case 2: this.next(); break
        case 3:
          this.changeNowIndex(renNum)
          break
      }
    },
    like () {
      if (!this.likelist) {
        this.likelist = []
      }
      if (this.isLike) {
        // 如果一开始时true，则将这首歌从喜欢列表里删除
        this.likelist = this.likelist.filter(item => {
          return item.songmid !== this.songMes.songmid
        })
      } else {
        // 如果一开始时false，则将这首歌加入喜欢列表
        this.likelist.push(this.songMes)
      }
      // 结束操作后从新将喜欢列表存入本地存储
      localStorage.setItem('likelist', JSON.stringify(this.likelist))
      // 是否喜欢取反
      this.isLike = !this.isLike
    },
    getLikeList () {
      if (this.likelist) {
        // 查询本地存储中是否有当前歌曲
        const result = this.likelist.some(item => item.songmid === this.songMes.songmid)
        result ? this.isLike = true : this.isLike = false
      }
    },
    getNowMes () {
      // 当前播放歌曲的信息
      this.songMes = this.songer[this.nowIndex]
      // 从本地存储获取喜欢列表
      this.likelist = JSON.parse(localStorage.getItem('likelist'))
    },
    getLatelyList () {
      // 从本地存储获取最近播放列表
      let latelyList = []
      const list = JSON.parse(localStorage.getItem('latelyList'))
      if (!list) {
        latelyList = []
      } else {
        latelyList = list
      }
      // 查询本地存储中是否有当前歌曲,如果存在先删除，再加到第一个位置
      latelyList = latelyList.filter(item => {
        return item.songmid !== this.songMes.songmid
      })
      latelyList.unshift(this.songMes)
      // 将最近播放从新加入本地存储
      localStorage.setItem('latelyList', JSON.stringify(latelyList))
    }
  },
  watch: {
    songer () {
      setTimeout(() => {
        this.play = true
        this.$refs.aduio.play()
      }, 500)
      // 是否加入喜欢，最近播放
      this.getNowMes()
      this.getLikeList()
      this.getLatelyList()
    },
    nowIndex (newValue) {
      // 如果播放地址不存在则跳到下一首
      if (!this.songer[this.nowIndex].aduioUrl) {
        const instance = Toast('暂无版权')
        setTimeout(() => {
          instance.close()
          this.nextSong()
        }, 2000)
        this.play = false
        return false
      }
      this.play = true
      // 是否加入喜欢，最近播放
      this.getNowMes()
      this.getLikeList()
      this.getLatelyList()
    },
    play (newValue, oldValue) {
      // 暂停和播放切换
      if (!this.aduio) return false
      if (newValue) {
        this.aduio.play()
        // 控制播放状态改变时图片是否旋转
        this.$refs.cd && (this.$refs.cd.className = 'img')
        this.$refs.smallCd && (this.$refs.smallCd.className = 'smallImg')
      } else {
        this.aduio.pause()
        this.$refs.cd && (this.$refs.cd.className = 'img paused')
        this.$refs.smallCd && (this.$refs.smallCd.className = 'smallImg paused')
      }
    },
    fullScreen (newValue) {
      // 控制切换控制器大小时图片是否旋转
      if (newValue) {
        this.$nextTick(() => {
          this.play && this.$refs.cd && (this.$refs.cd.className = 'img')
          !this.play && this.$refs.cd && (this.$refs.cd.className = 'img paused')
        })
      } else {
        this.$nextTick(() => {
          !this.play && this.$refs.smallCd && (this.$refs.smallCd.className = 'smallImg paused')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style";
.controller {
  position: fixed;
  width: 100%;
  bottom: 60 * $rem + rem;
  display: flex;
  font-size: 24px;
  justify-content: space-around;
}
.yellow{
  color: $yellow;
}
.red{
  color: red !important;
}
.bg {
  img {
    width: 100%;
    height: 100%;
    background: #333;
    filter: blur(20px);
  }
  position: fixed;
  z-index: -1;
  width: 100%;
  bottom: 0;
  top: 0;
}
.iconfont {
  font-size: 32px;
  color: $yellow;
}
.big {
  background: rgb(34, 34, 34);
  position: fixed;
  color: #fff;
  z-index: 105;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  .back {
    height: 40px;
    display: flex;
  }
  h2 {
    font-size: $fs-xl;
    text-align: center;
    padding-right: 40px;
    width: calc(100% - 80px);
    line-height: 40px;
  }
  h3 {
    width: 100%;
    height: 18px;
    font-size: $fs-m;
    padding-bottom: 30px;
    text-align: center;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .img {
    @include w(300);
    @include h(300);
    margin: 20px auto;
    animation: rotate 30s linear infinite;

    img {
      @include w(280);
      @include h(280);
      border-radius: 50%;
      border: 10px solid rgba(0, 0, 255, 0.1);
    }
  }

  audio {
    display: block;
    margin: 30px auto;
  }
  .icon-shangyiye {
    padding-left: 10px;
    color: $yellow;
    font-size: 24px;
    width: 30px;
    height: 40px;
    line-height: 40px;
  }
}
.small {
  width: 100%;
  height: 60px;
  background: #333;
  z-index: 105;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  font-size: $fs-s;
  .songName {
    color: #fff;
    font-size: $fs-m;
  }
  .singerName {
    color: #fff;
    color: hsla(0, 0%, 100%, 0.3);
  }
  .smallImg {
    width: 40px;
    height: 40px;
    animation: rotate 30s linear infinite;
    margin: 0 20px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .songMes {
    @include w(150);
  }
  .playWarp {
    @include w(120);
    text-align: right;
  }
}

.paused {
  animation-play-state: paused !important;
}
@keyframes rotate {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
