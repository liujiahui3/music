<template>
  <div class="search">
    <div class="box">
      <span class="iconfont icon-sousuo"></span>
      <input type="text" placeholder="搜索歌曲、歌手" v-model="test">
      <span class="iconfont icon-cuo" @click="test = ''"></span>
    </div>
    <div class="hot" v-if="!test">
      <h2>热门搜索</h2>
      <ul>
        <li v-for="(data,index) in hotList" :key="index" @click="test = data">{{data.trim()}}</li>
      </ul>
    </div>
    <div v-else class="wrapper" ref="wrapper">
      <div class="content" ref="content">
      <ul>
        <li v-for="item in list" :key="item.id" @click="todetail(item)">
          {{item.songname}}-{{item.singer[0].name}}
        </li>
      </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getSearch } from '../api/api'
import BS from 'better-scroll'
export default {
  data () {
    return {
      test: '',
      list: [],
      hotList: ['我们的歌', '冰雪奇缘2', '张杰', '桥边姑娘', '星辰大海', '哪咤 李宇春', '左手指月', '邓紫棋', '左肩', '酒醉的蝴蝶']
    }
  },
  watch: {
    test (newValue) {
      // https://y.gtimg.cn/music/photo_new/T002R300x300M000001rWuXt3yx2wT.jpg?max_age=2592000
      // https://c.y.qq.com/soso/fcgi-bin/client_search_cp?p=1&n=20&w=%E5%86%B0%E9%9B%AA%E5%A5%87%E7%BC%982%20&cr=1&aggr=1&jsonpCallback=__jp13
      // 为空时不发请求
      if (!newValue) { return false }
      clearTimeout(this.timer)
      // 节流
      this.timer = setTimeout(() => {
        // 请求搜索数据
        getSearch(this.test).then((res) => {
          this.list = res.data.data.song.list
        })
      }, 200)
    }
  },
  methods: {
    todetail (item) {
      console.log(item)
      console.log(item.pic)
    },
    handleList (data) {
    },
    bsInit () {
      this.bs = null
      const wrapper = this.$refs.wrapper
      this.bs = new BS(wrapper, { click: true })
    }
  }
}
</script>
<style lang="scss" scoped>

@import "~../style";
.search{
  background: $black2;
  position: fixed;
  top:87px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.wrapper{
  width: 100%;
  @include h(482);
  overflow: hidden;
  ul{
    @include w(335);
    margin: 0 auto;
  }
  li{
    color: hsla(0,0%,100%,.3);
    font-size: $fs-s;
    padding: 10px 0;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
.box{
  display: flex;
  align-items: center;
  @include w(335);
  @include h(20);
  background: #333;
  border-radius: 20px;
  padding: 10px;
  margin:30px 0;
  .iconfont{
    font-size: 20px;
  }
  input{
    border: 0;
    outline: none;
    background: #333;
    padding-left: 30px;
    height: 20px;
     @include w(250);
     color: #aaa;
  }
}
.hot{
  color: #777;
  width: 100%;
  h2{
    font-size: $fs-m;
    font-weight: 500;
    margin-bottom: 15px;
    padding-left: 20px;
  }
  ul{
      @include w(335);
      margin: 0 auto;
  }
  li{
  float: left;
  font-size: $fs-s;
  background: #333;
  padding: 5px;
  margin: 10px;
  border-radius: 10px;
  }
}
</style>
