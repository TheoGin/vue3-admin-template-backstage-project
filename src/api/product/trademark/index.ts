import request from '@/utils/request'
import type { Trademark, TrademarkResponceData } from './type'

enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 新增品牌
  ADDRTREADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改已有品牌
  UPDATETREADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除已有品牌
  DELETETREADEMARK_URL = '/admin/product/baseTrademark/remove/',
}

export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResponceData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

export const reqAddOrUpdateTrademark = (data: Trademark) => {
  if (data.id) {
    // 修改已有品牌
    return request.put<any, any>(API.UPDATETREADEMARK_URL, data)
  } else {
    // 新增品牌
    return request.post(API.ADDRTREADEMARK_URL, data)
  }
}

export const reqDeleteTrademark = (id: number) =>
  request.delete(API.DELETETREADEMARK_URL + id)
