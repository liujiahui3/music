<template>
  <div class="play"
       v-if="songer.length">
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
      <div class="bg">
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
        <span>❤</span>
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
import lyric from './lyric'
export default {
  components: {
    myProgress, lyric
  },
  mounted () {

  },
  data () {
    return {
      loops: ['单曲', '列表', '随机'],
      play: true,
      enTime: 0,
      startTime: 0,
      changeTime: 0
    }
  },
  computed: {
    ...mapState(['songer', 'nowIndex', 'fullScreen', 'loop']),
    imgUrl () {
      // 图片地址
      return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.songer[this.nowIndex].albummid}.jpg?max_age=2592000`
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
      // console.log(this.songer)
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
    }
  },
  watch: {
    nowIndex () {
      this.play = true
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
