const TABLE_ID = '47648'
const Products = new wx.BaaS.TableObject(TABLE_ID)

// 查询
export function getList() {
  const query = new wx.BaaS.Query()

  query.compare('status', '=', true)
  return Products.setQuery(query).find()
}

// 查询详情
export function getById(id) {
  return Products.get(id)
}

// 创建
// 调用创建数据项接口，进行数据的持久化存储，详见：https://doc.minapp.com/js-sdk/schema/create-record.html
export function create(data) {
  const product = Products.create()

  return product.set(data)
    .save()
}

// 更新
export function update(id, data) {
  const product = Products.getWithoutData(id)

  return product.set(data)
    .update()
}

// 删除
export function del(id) {
  return Products.delete(id)
}

// 数量 +1
export function add(id) {
  const product = Products.getWithoutData(id)

  product.incrementBy('amount', 1)
  product.incrementBy('total_amount', 1)
  return product.update()
}

// 数量 -1
export function subtract(id) {
  const product = Products.getWithoutData(id)

  product.incrementBy('amount', -1)
  return product.update()
}

// 清空当日销量
export function clear(id) {
  const product = Products.getWithoutData(id)

  product.set('amount', 0)
  return product.update()
}

export default {
  getList,
  getById,
  create,
  update,
  del,
  add,
  subtract,
  clear
}