const MinappFile = new wx.BaaS.File()
const CATEGORY_ID = '5b6e74a2e974860a59aaf1f7' // cookbook category id

// 上传图片
export function upload(urls = []) {
  if (!Array.isArray(urls)) return Promise.reject('images length is 0. selector error.')
  if (!urls.length) return Promise.reject('images length is 0. selector error.')
  console.log(urls)
  const options = {
    categoryID: CATEGORY_ID
  }
  return Promise.all(urls.map(item => MinappFile.upload({
    filePath: item
  }, options)))
}

// 删除图片
export function del(id) {
  return MinappFile.delete(id)
}

export default {
  upload,
  del
}