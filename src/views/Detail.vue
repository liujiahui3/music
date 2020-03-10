<template>
  <div class="detail" ref="detail">
    <span class="iconfont icon-shangyiye" @click="back"></span>
    <h2>{{name}}</h2>
    <div ref="img" class="bg">
      <div class="shade"></div>
    </div>
    <div class="play-random" ref="random">
      <div @click="goPlay(songList,random())">
        <span class="iconfont icon-bofang"></span>
        随机播放全部
      </div>
    </div>
    <div class="wrapper" ref="wrapper">
      <div class="content" ref="content">
        <ul>
          <li v-for="(item,index) in songList" :key="item.songmid" @click="goPlay(songList,index)">
            <div class="left" v-if="rankShow">
              <span v-if="index<3" class="iconfont icon-yijingkuozhandaochuSVG_"></span>
              <span v-else>{{index+1}}</span>
              </div>
            <div>
              <h3>{{ item.songname }}</h3>
              <p>{{ item.singer[0].name }}-{{ item.albumname }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getSongUrl } from '@/api/api'
import { Toast } from 'mint-ui'
import { fromSinger, fromRecommend, fromRank } from '../utils/detaliSwitch.js'
import BS from 'better-scroll'
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      songList: [],
      name: '',
      imgUrl: '',
      rankShow: false
    }
  },
  async mounted () {
    const instance = Toast('加载中')
    const id = this.$route.query.id
    const type = this.$route.query.type
    let result = []
    // 歌手页面进入
    if (type === 'singer') {
      // 根据歌手id获取对应的歌曲数据
      await fromSinger(id).then(res => {
        result = res
      })
    } else if (type === 'rec') {
      // 推荐页面进入
      // 根据歌单id获取对应的歌曲数据
      await fromRecommend(id).then(res => {
        result = res.list
        this.imgUrl = res.imgUrl
        this.name = res.name
      })
    } else {
      this.rankShow = true
      // 排行页面进入
      // 根据排行id获取对应的歌曲数据
      const bgurl = this.$route.query.bgurl
      this.imgUrl = bgurl
      await fromRank(id).then(res => {
        this.name = res.topinfo.ListName
        result = res.list
      })
    }
    // 取出所有id
    const mids = result.map(item => {
      return item.songmid
    })
    // 根据id请求对应歌曲的地址
    const { urls } = await getSongUrl({ mids }).then(res => {
      return res.data
    })
    // 将歌曲地址存入对应的数组项中
    result = result.filter((item, index, arr) => {
      // 将vip歌曲从列表中删除
      if (!urls[index]) {
        return false
      }
      item.aduioUrl = urls[index]
      return item
    })
    this.songList = result
    // 初始化
    this.$nextTick(() => {
      this.BsInit()
      this.bgInit()
      instance.close()
    })
  },
  watch: {
    songer () {
      if (this.songer.length > 0) {
        this.$refs.wrapper.style.bottom = '60px'
      }
    }
  },
  computed: {
    ...mapState(['songer'])
  },
  methods: {
    ...mapMutations(['changeSonger', 'changeNowIndex', 'changeFullScreen']),
    iconName () {

    },
    random () {
      // 随机数
      const length = this.songer.length
      const index = parseInt(Math.random() * length)
      return index
    },
    goPlay (songList, index) {
      this.changeSonger(songList)
      this.changeNowIndex(index)
      this.changeFullScreen(true)
    },
    BsInit () {
      // 初始化better-scroll
      const wrapper = this.$refs.wrapper
      this.bs = new BS(wrapper, { click: true, probeType: 3 })
      const img = this.$refs.img
      const imgH = img.clientHeight
      // 防止随机播放按钮盖住歌曲列表
      this.bs.on('scroll', ({ y }) => {
        // 防止找不到元素时报错
        if (this.$refs.random) {
          if (y < 0) {
            // 列表挡住按钮隐藏
            this.$refs.random.style.zIndex = -10
          } else {
            // 列表下拉放大背景
            this.$refs.random.style.zIndex = 103
            const precent = 1 + y / imgH
            img.style.transform = `scale(${precent})`
          }
        }
      })
    },
    back () {
      this.$router.back()
    },
    bgInit () {
      // 歌手背景图
      if (this.$route.query.type === 'rec') {
        // 入口为推荐页
        this.$refs.img.style.background = `url(${this.imgUrl}) center 0px no-repeat`
      } else if (this.$route.query.type === 'singer') {
        // 入口为歌手页
        this.$refs.img.style.background = `url(https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.songList[0].singer[0].mid}.jpg?max_age=2592000) center 0px no-repeat`
        this.name = this.songList[0].singer[0].name
      } else {
        this.$refs.img.style.background = `url(${this.imgUrl}) center 0px no-repeat`
      }
      this.$refs.img.style.backgroundSize = 'cover'
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style";
.detail {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $black2;
  z-index: 103;
  .wrapper {
    position: relative;
    z-index: 100;
    overflow: hidden;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    top: 44px;
    h3 {
      font-weight: 500;
      color: #fff;
      font-size: $fs-s;
      height: 44px;
      line-height: 64px;
    }
    p {
      font-weight: 500;
      color: rgba(255, 255, 255, 0.3);
      font-size: $fs-s;
      height: 20px;
    }

  }
  .content {
      padding-top: 215rem * $rem;
      ul {
        background: $black2;
        padding: 10px 30px;
        li{
          display: flex;
          align-items: center;
          font-size: $fs-m;
          color: $yellow;
        }
        .left{
          @include w(25);
          @include h(25);
          margin-right: 25px;
          text-align: center;
          margin-top: 25px;
        }
      }
    }
  .icon-shangyiye {
    width: 36px;
    height: 36px;
    font-size: 24px;
    position: fixed;
    top: 5px;
    left: 10px;
    color: $yellow;
    z-index: 100;
  }
  .bg {
    width: 100%;
    height: 0;
    padding-top: 70%;
  }
  .play-random {
    position: fixed;
    z-index: 101;
    top: 30%;
    width: 100%;
    font-size: $fs-s;
    color: $yellow;
    div {
      position: relative;
      z-index: 103;
      width: 135rem * $rem;
      height: 32px;
      line-height: 32px;
      margin: 0 auto;
      text-align: center;
      border: 1px solid $yellow;
      border-radius: 20px;
    }
  }
  .shade {
    width: 100%;
    padding-top: 70%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(7, 17, 27, 0.4);
  }
  h2 {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    line-height: 40px;
    font-size: 18px;
    color: #fff;
    font-weight: 500;
  }
}
</style>
