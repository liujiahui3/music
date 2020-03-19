<template>
  <div class="singer">
    <div class="wrapper"
         ref="wrapper">
      <div class="content">
        <ul>
          <li v-for="item in singer"
              :key="item.Findex"
              :ref="item.Findex">
            <h3>{{item.Findex}}</h3>
            <ul>
              <li v-for="sitem in item.list"
                  :key="sitem.Fsinger_id"
                  @click="toDateil(sitem.Fsinger_mid)">
                <img :src="'https://y.gtimg.cn/music/photo_new/T001R300x300M000'+sitem.Fsinger_mid+'.jpg?max_age=2592000'"
                     alt="">
                <span>{{sitem.Fsinger_name}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <ol>
        <li v-for="item in quickData"
            :key="item"
            :class="item==sel?'sel':''"
            @click="quickJump(item)"
            @touchstart="touchstart(item,$event)"
            @touchmove="touchmove"
            @touchend="touchend">{{item}}</li>
      </ol>
    </div>
    <transition  enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { getSingerData } from '@/api/api'
import BScroll from 'better-scroll'
import { formattedData } from '@/utils/formattedData'
export default {
  data () {
    return {
      singer: [],
      sel: 'hot'
    }
  },
  created () {
    // 将移动距离数据挂载到this对象下
    this.touch = { y: 0 }
    // 发请求获取数据
    getSingerData().then(data => {
      // 对数据进行改造
      formattedData(data).then(data => {
        this.singer = data
        this.$nextTick(() => {
          // 初始化better-scroll
          this.BSinit()
        })
      })
    })
  },
  methods: {
    toDateil (id) {
      const url = `/singer/detail?id=${id}&type=singer`
      this.$router.push(url)
    },
    touchstart (item, e) {
      const y = e.touches[0].pageY
      this.touch.y = y
      this.touch.startIndex = this.quickData.indexOf(item)
    },
    touchmove (e) {
      // 快速入口
      const moveY = e.touches[0].pageY
      const moveSize = moveY - this.touch.y
      const moveDir = parseInt(moveSize / 18)
      const nowDir = this.quickData[this.touch.startIndex + moveDir]
      this.quickJump(nowDir)
    },
    touchend () {
      // console.log(3)
    },
    quickJump (item) {
      if (this.$refs[item]) {
        const dom = this.$refs[item][0]
        this.BS.scrollToElement(dom)
      }
    },
    BSinit () {
      // 用ref获取元素
      const wrapper = this.$refs.wrapper
      // 初始化better-scroll
      this.BS = new BScroll(wrapper, { probeType: 3, click: true })
      const distance = []
      // 将每一块内容的offset存入数组
      for (const key in this.$refs) {
        if (key !== 'wrapper') {
          distance.push(this.$refs[key][0].offsetTop)
        }
      }
      // 监听滚动
      this.BS.on('scroll', (pos) => {
        let scrollIndex = 0
        const y = Math.abs(pos.y)
        // 滚动时用当前的offerset和每一个的offerset作比较,来判断在哪一块,获取索引
        distance.forEach((item, index, arr) => {
          if (y >= item && y < arr[index + 1]) {
            scrollIndex = index
            return false
          } else if (y >= distance[distance.length - 1]) {
            // 最有一块的边界判断
            scrollIndex = distance.length - 1
          }
          // 根据索引改变当前选中的大写字母
          this.sel = this.quickData[scrollIndex]
        })
      })
    }
  },
  activated () {
    if (this.Bs) {
      this.BS.refresh()
    }
  },
  computed: {
    // 首字母数组
    quickData () {
      return this.singer.map(item => {
        return item.Findex
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style";
.wrapper {
  touch-action: none;
  background: #222;
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  .content{
    touch-action: none
  }
  h3 {
    color: rgba(255, 255, 255, 0.5);
    background: #333333;
    padding-left: 20px;
    font-size: $fs-xs;
    @include h(30);
    line-height: 30rem * $rem;
  }
  img {
    @include h(50);
    @include w(50);
    border-radius: 50%;
  }
  ul {
    ul {
      padding-bottom: 30rem * $rem;
      li {
        @include h(50);
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        font-size: $fs-m;
      }
      span {
        color: rgba(255, 255, 255, 0.5);
        font-size: $fs-s;
        padding-left: 20px;
      }
    }
  }
}
ol {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 165rem * $rem;
  right: 5rem * $rem;
  z-index: 100;
  li {
    width: 20px;
    height: 18px;
    color: rgba(255, 255, 255, 0.5);
    font-size: $fs-xs;
    text-align: center;
    line-height: 18px;
  }
  .sel {
    color: #f2c331;
  }
}
</style>
