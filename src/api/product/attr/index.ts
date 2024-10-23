import request from '@/utils/request'
import type { AttrResponceData, CategoryResponceData, Attr } from './types'

enum API {
  // 一级分类接口的url
  C1_URL = '/admin/product/getCategory1',
  // 二级分类接口的url
  C2_URL = '/admin/product/getCategory2/',
  // 三级分类接口的url
  C3_URL = '/admin/product/getCategory3/',
  // 根据三级分类获取商品基础属性接口
  ATTR_URL = '/admin/product/attrInfoList/',
  // 商品基础属性新增 | 修改接口
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  // 删除商品基础属性接口
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

// 请求一级分类数据
export const reqC1 = () => request.get<any, CategoryResponceData>(API.C1_URL)

// 请求二级分类数据
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategoryResponceData>(API.C2_URL + category1Id)

// 请求三级分类数据
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategoryResponceData>(API.C3_URL + category2Id)

export const reqAttrByCategoryId = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<any, AttrResponceData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )

// 请求商品基础属性新增 | 修改接口
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR_URL, data)

// 删除商品基础属性接口
export const reqDeleteAttr = (attrId: number | string) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId)
