const formattedData = async (data) => {
  const obj = { hot: [] }
  data.forEach((item, index) => {
    if (item.Findex === '9') { return false }// 丢弃一个不想要的数据
    // 前十个放到热门里
    if (index < 10) { obj.hot.push(item) }
    // 对象中没有件创建,key为首位大写字母
    if (!obj[item.Findex]) {
      obj[item.Findex] = [item]
    } else {
      // 有就添加
      obj[item.Findex].push(item)
    }
  })
  const result = []
  for (const key in obj) {
    // 对象转数组
    const item = {}
    item.Findex = key
    item.list = obj[key]
    result.push(item)
  }
  // 排序
  result.sort((a, b) => { return a.Findex.charCodeAt() - b.Findex.charCodeAt() })
  // 将热门放到数组第一位
  result.unshift(result.pop())
  return result
}

export {
  formattedData
}
