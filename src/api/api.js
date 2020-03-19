import axios from '../utils/axios'
import jsonp from 'jsonp'
/** *********** 推荐页************* */
// 请求轮播图数据,并返回一个promise对象
const getBannerData = () => {
  const url =
    '/hehe/music/api/getTopBanner?g_tk=1928093487&inCharset=utf8&outCharset=utf-8&notice=0&format=json&platform=yqq.json&hostUin=0&needNewCode=0&-=recom45087281820185865&data=%7B%22comm%22:%7B%22ct%22:24%7D,%22category%22:%7B%22method%22:%22get_hot_category%22,%22param%22:%7B%22qq%22:%22%22%7D,%22module%22:%22music.web_category_svr%22%7D,%22recomPlaylist%22:%7B%22method%22:%22get_hot_recommend%22,%22param%22:%7B%22async%22:1,%22cmd%22:2%7D,%22module%22:%22playlist.HotRecommendServer%22%7D,%22playlist%22:%7B%22method%22:%22get_playlist_by_category%22,%22param%22:%7B%22id%22:8,%22curPage%22:1,%22size%22:40,%22order%22:5,%22titleid%22:8%7D,%22module%22:%22playlist.PlayListPlazaServer%22%7D,%22new_song%22:%7B%22module%22:%22newsong.NewSongServer%22,%22method%22:%22get_new_song_info%22,%22param%22:%7B%22type%22:5%7D%7D,%22new_album%22:%7B%22module%22:%22newalbum.NewAlbumServer%22,%22method%22:%22get_new_album_info%22,%22param%22:%7B%22area%22:1,%22sin%22:0,%22num%22:10%7D%7D,%22new_album_tag%22:%7B%22module%22:%22newalbum.NewAlbumServer%22,%22method%22:%22get_new_album_area%22,%22param%22:%7B%7D%7D,%22toplist%22:%7B%22module%22:%22musicToplist.ToplistInfoServer%22,%22method%22:%22GetAll%22,%22param%22:%7B%7D%7D,%22focus%22:%7B%22module%22:%22QQMusic.MusichallServer%22,%22method%22:%22GetFocus%22,%22param%22:%7B%7D%7D%7D'
  return axios(url)
}
const getSingListData = () => {
  // 请求推荐页的歌单数据,并返回一个promise对象
  const url =
    '/hehe/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.2902271073203013'
  return axios(url)
}
const getDisstList = disstid => {
  // 请求推荐页的歌单数据,并返回一个promise对象
  const url =
    `/hehe/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=${disstid}&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0`
  return axios(url)
}
/** *********** 歌手页************* */
const getSingerData = () => {
  // 请求歌手数据,并返回一个promise对象
  const url =
    'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq'
  return new Promise((resolve, reject) => {
    jsonp(url, { param: 'jsonpCallback' }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.data.list)
      }
    })
  })
}
/** *********** 排行页************* */
const getRankList = () => {
  // 请求歌曲列表,并返回一个promise对象
  const url = '/music/fcj/music/topRank'
  return axios(url)
}
const getRankSong = (topid) => {
  // 请求歌曲列表,并返回一个promise对象
  const url = '/music/fcj/music/rankSongList'
  return axios.post(url, { topid })
}
/** *********** 详情页************* */
const getSongList = singermid => {
  // 请求歌曲列表,并返回一个promise对象
  var url = '/music/fcj/music/songListById'
  return axios.post(url, { singermid })
}
const getSongUrl = mids => {
  // 请求歌曲链接,并返回一个promise对象
  var url = '/music/fcj/music/songurl'
  return axios.post(url, mids)
}
/** *********** 搜素页************* */
const getSearch = kw => {
  // 请求歌曲链接,并返回一个promise对象
  var url = `/hehe/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=${kw}&p=1&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5`
  return axios(url)
}
/** *********** 播放页************* */
const getLyric = songmid => {
  // 请求歌词数据,并返回一个promise对象
  // const url = '/music/fcj/music/lyric'
  const url = '/music/fcj/music/lyric'
  return axios.post(url, { songmid })
}
export { getSearch, getBannerData, getSingListData, getSingerData, getSongList, getSongUrl, getLyric, getDisstList, getRankList, getRankSong }
