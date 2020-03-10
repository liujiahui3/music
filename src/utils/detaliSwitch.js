import { getSongList, getDisstList, getRankSong } from '@/api/api'
// 歌手页进入详情页
async function fromSinger (id) {
  let result = []
  // 根据歌手id获取对应的歌曲数据
  result = await getSongList(id).then(res => {
    // 对歌曲数据进行筛选,获取自己需要的
    return processData(res.data.data)
  }).catch(err => {
    console.log(err)
  })
  return result
}
// 排行页进入详情页
async function fromRank (id) {
  let result = []
  // 根据歌手id获取对应的歌曲数据
  // console.log(id)
  result = await getRankSong(id).then(res => {
    // 对歌曲数据进行筛选,获取自己需要的
    return processRankData(res.data)
  }).catch(err => {
    console.log(err)
  })
  return result
}
// 推荐页进入详情页
async function fromRecommend (id) {
  let result = []
  result = await getDisstList(id).then(res => {
    return processDissData(res.data)
  }).catch(err => {
    console.log(err)
  })
  return result
}

function processData (data) {
  // 对歌曲数据进行筛选,获取自己需要的
  const { list } = data
  const result = list.map((item) => {
    const { albummid, albumname, songname, singer, songmid } = item.musicData
    return { albummid, albumname, songname, singer, songmid }
  })
  return result
}
function processRankData (data) {
  const obj = {}
  obj.topinfo = data.topinfo
  // 对歌曲数据进行筛选,获取自己需要的
  const result = data.songlist.map((item) => {
    const { albummid, albumname, songname, singer, songmid } = item.data
    return { albummid, albumname, songname, singer, songmid, name }
  })
  obj.list = result
  return obj
}

function processDissData (data) {
  const obj = {}
  // 对歌单数据进行筛选,获取自己需要的
  const list = data.cdlist[0].songlist
  const result = list.map((item) => {
    const { albummid, albumname, songname, singer, songmid } = item
    return { albummid, albumname, songname, singer, songmid }
  })
  // 列表数据
  obj.list = result
  // 背景图
  obj.imgUrl = data.cdlist[0].logo
  // 歌单名字
  obj.name = data.cdlist[0].dissname
  return obj
}

export { fromSinger, fromRecommend, fromRank }
