<template>
  <ul>
    <li v-for="item in dataList" :key="item.dissid" @click="toDetail(item.dissid)">
      <div class="left">
        <img v-lazy="item.imgurl" alt="">
      </div>
      <div>
        <h2>{{item.creator.name}}</h2>
        <p>{{item.dissname}}</p>
      </div>
    </li>
  </ul>
</template>
<script>
import { getSingListData } from '../../api/api'
export default {
  data () {
    return {
      dataList: []
    }
  },
  props: ['isrefresh'],
  mounted () {
    // 如果本地存储有数据,就使用本地数据
    if (sessionStorage.getItem('songList')) {
      this.dataList = JSON.parse(sessionStorage.getItem('songList'))
    } else {
      this.refresh()
    }
  },
  methods: {
    toDetail (id) {
      const url = `/recommend/detail?id=${id}&type=rec`
      this.$router.push(url)
    },
    refresh () {
      // 发起请求,获取数据后存入本地存储
      getSingListData().then(data => {
        this.dataList = data.data.data.list
        sessionStorage.setItem('songList', JSON.stringify(this.dataList))
      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    isrefresh () {
      this.refresh()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style';
ul{
  color: white;
  .left{
    padding-right:23rem*$rem;
  }
  li{
    display: flex;
    padding: 20rem*$rem;
    padding-top: 0;
    font-size: $fs-s;
    align-items: center;
  }
  h2{
    font-size:$fs-s;
    font-weight: 500;
    margin-bottom: 10rem*$rem;
  }
  p{
    color: #535353;
  }
  img{
    @include w(60);
    @include h(60)
  }
}

</style>
