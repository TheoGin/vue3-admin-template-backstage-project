// Sku 接口
import request from '@/utils/request'
import type { SkuListResponseData } from './type'

// 统一管理 SKU 接口
enum API {
  // SKU 列表接口url
  SKU_LIST = '/admin/product/list/',
  // 上架SKU接口url
  ON_SALE_SKU = '/admin/product/onSale/',
  // 下架SKU接口url
  CANCEL_SALE_SKU = '/admin/product/cancelSale/',
  // 获取SKU商品信息接口url
  SKU_INFO = '/admin/product/getSkuInfo/',
  // 删除SKU接口url
  DELETE_SKU = '/admin/product/deleteSku/',
}

// 获取 SKU 列表
export const reqGetSkuList = (page: number, limit: number) =>
  request.get<any, SkuListResponseData>(API.SKU_LIST + `${page}/${limit}`)

// 上架SKU
export const reqOnSaleSku = (skuId: number | string) =>
  request.get<any, any>(API.ON_SALE_SKU + skuId)

// 下架SKU
export const reqCancelSaleSku = (skuId: number | string) =>
  request.get<any, any>(API.CANCEL_SALE_SKU + skuId)

// 获取SKU商品信息
export const reqGetSkuInfo = (skuId: number | string) =>
  request.get<any, any>(API.SKU_INFO + skuId)

// 删除SKU
export const reqDeleteSku = (skuId: number | string) =>
  request.delete<any, any>(API.DELETE_SKU + skuId)
