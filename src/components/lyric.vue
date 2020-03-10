<template>
  <div class="lyric">
    <div class="content">
      {{text}}
    </div>
  </div>
</template>
<script>
import { getLyric } from '../api/api'
import { mapState } from 'vuex'
import { Base64 } from 'js-base64'
import Lyric from 'lyric-parser'
export default {
  data () {
    return {
      text: '暂无歌词'
    }
  },
  mounted () {
    // 根据id获取对应的歌词
    const mid = this.songer[this.nowIndex].songmid
    getLyric(mid).then(res => {
      // 对数据进行解码
      this.decode = Base64.decode(res.data.lyric)
      this.showLyric()
      if (this.play) {
        this.lyricObj.seek(this.startTime * 1000)
      } else {
        this.lyricObj.seek(this.startTime * 1000)
        this.lyricObj.stop()
      }
    })
  },
  computed: {
    // 歌曲列表,当前歌曲下标
    ...mapState(['songer', 'nowIndex'])
  },
  props: ['startTime', 'play', 'changeTime'],
  watch: {
    play () {
      // 播放状态发生改变时同时改变歌词的播放状态
      if (!this.lyricObj) return false
      this.lyricObj.togglePlay()
    },
    changeTime (newValue) {
      this.lyricObj.seek(newValue * 1000)
    },
    nowIndex () {
      // 根据id获取对应的歌词
      const mid = this.songer[this.nowIndex].songmid
      getLyric(mid).then(res => {
        // 对数据进行解码
        this.decode = Base64.decode(res.data.lyric)
        this.showLyric()
      })
    }
  },
  methods: {
    showLyric () {
      if (this.lyricObj) {
        this.lyricObj.stop()
        this.text = ''
      }
      // 处理歌词
      this.lyricObj = new Lyric(this.decode, ({ txt }) => {
        this.text = txt
      })
      // 歌词开始播放
      this.lyricObj.play()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style";
.lyric {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  .content {
    @include w(300);
    text-align: center;
    font-size: $fs-m;
    color: #666;
    height: 20px;
    line-height: 20px;
  }
}
</style>
