<template>
  <div>
    <div class="wrap">
      <span>{{startTime | handTime}}</span>
      <div class="content"
       @click="seek"
        ref="content"
        @touchstart="touchStart"
        @touchmove.prevent="touchMove"
        @touchend="touchEnd">
        <div class="location" ref="location"></div>
        <div class="dot" ref="dot">
          <div class="center"></div>
        </div>
      </div>
      <span>{{enTime | handTime}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['enTime', 'startTime'],
  filters: {
    handTime (time) {
      // 将秒数转变成00:00格式
      time = parseInt(time)
      const m = parseInt(time / 60)
      let s = time % 60
      s = s < 10 ? '0' + s : s
      return m + ':' + s
    }
  },
  watch: {
    startTime () {
      // 监听当前歌曲时间,改变进度条
      this.chengeProg()
    }
  },
  methods: {
    seek (e) {
      // 获取点击位置相对于整个进度条的比例
      // console.log(e)
      const X = e.pageX
      const ratio = (X - this.Left) / this.conWidth
      // 将比例发送给父组件
      this.$emit('mySeek', ratio)
    },
    touchStart (e) {
      // 当前是按下状态
      this.touch = true
    },
    touchMove (e) {
      // 获取拖动时位置相对于整个进度条的比例
      const X = e.touches[0].pageX
      const ratio = (X - this.Left) / this.conWidth * 100
      // 根据这个比例实时的改变进度条的长度
      if ((X - this.Left) >= 0 && (X - this.Left) <= this.conWidth) {
        // 边界判断
        this.$refs.location.style.width = ratio + '%'
        this.$refs.dot.style.left = ratio + '%'
      }
    },
    touchEnd (e) {
      // 获取拖动结束位置相对于整个进度条的比例
      const X = e.changedTouches[0].pageX
      const ratio = (X - this.Left) / this.conWidth
      // 将比例传给父组件,改变歌曲的播放
      this.$emit('mySeek', ratio)
      // 关闭按下状态
      this.touch = false
    },
    chengeProg () {
      if (this.touch) return false
      // 获取当前时间相当于整个进度条的比例
      const ratio = (this.startTime / this.enTime) * 100
      // 根据比例修改进度条长度
      this.$refs.location.style.width = ratio + '%'
      this.$refs.dot.style.left = ratio + '%'
    }
  },
  mounted () {
    // 进度条到页面左边的距离
    this.Left = this.$refs.content.getBoundingClientRect().left
    // 进度条的总长度
    this.conWidth = this.$refs.content.clientWidth
    // 当前是否是按下状态
    this.touch = false
    // 加载当前进度条位置
    this.chengeProg()
  }
}
</script>
<style lang="scss" scoped>
@import "../style";
.wrap {
  display: flex;
  margin-top:50px;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: $fs-xs;
  .content {
    position: relative;
    @include w(240);
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
  }
  span{
    width: 50px;
    text-align: center;
  }
  .location{
    height: 100%;
    background: $yellow;
  }
  .dot{
    width: 11px;
    height: 11px;
    border: 5px solid #fff;
    border-radius: 50%;
    background: $yellow;
    position: absolute;
    top: -8px;
    transform: translateX(-8px)
  }
}
</style>
