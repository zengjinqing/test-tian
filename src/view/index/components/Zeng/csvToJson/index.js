import { readdirSync, readFileSync, writeFileSync } from 'fs'
const dirs = readdirSync('./static')
let fileName = 'NOAA-_ISD_QZ.csv'


dirs.filter(dir => /\.csv$/.test(dir)).forEach(dir => {
    const file = readFileSync(`./static/${fileName}`)
  	const getGBK = new TextDecoder('gbk').decode(file).split('\r\n')
  	// 获取表头, 用于组装数据
  	const headList = getGBK[0].split(',')
    const headLen = headList.length
    const gbkLen = getGBK.length
	let json= []
    // 遍历文件, 注意是从 i = 1 开始, 因为不需要表头
	for (let i = 1; i < gbkLen; i++) {
	    const gbkItem = getGBK[i]
	    const childList = gbkItem.split(',')
	    if (childList.length === 1) break // 说明该数据是空数据格式
	    const obj = {}
	    // 遍历表头数组
	    for (let j = 0; j < headLen; j++) {
	      const headItem = headList[j]
	      obj[headItem] = childList[j]
	    }
	    json.push(obj)
	  }
	  // 得到不需要文件后缀的名称
	  const getFile = fileName.split('.')[0]
	  // 写入文件数据
	  writeFileSync(`./static/${getFile}.json`, JSON.stringify(json))
	})
