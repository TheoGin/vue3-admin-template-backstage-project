import request from '@/utils/request'
import type {
  SpuHasImgResponseData,
  SpuListResponseData,
  TradeMarkListResponseData,
  SaleAttrListResponseData,
  AllSaleAttrResponseData,
  SPUData,
  SkuData,
  SkuListResponseData,
} from './type'
size
enum API {
  //获取已有的SPU的数据
  GET_HASSPU_LIST_URL = '/admin/product/',
  //获取全部品牌的数据
  GET_ALL_TRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取SPU的图片数据
  GET_SPU_IMAGE_URL = '/admin/product/spuImageList/',
  //获取SPU的已有的销售属性
  GET_SPU_SALE_ATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目全部的销售属性[颜色、版本、尺码]
  GET_ALL_SALE_ATTR_URL = '/admin/product/baseSaleAttrList',
  // 添加SPU
  ADD_SPU_URL = '/admin/product/saveSpuInfo',
  // 修改SPU
  UPDATE_SPU_URL = '/admin/product/updateSpuInfo',
  // 添加SKU
  ADD_SKU_URL = '/admin/product/saveSkuInfo',
  // 查看SKU列表
  GET_SKU_LIST_URL = '/admin/product/findBySpuId/',
  // 删除SPU
  DELETE_SPU_URL = '/admin/product/deleteSpu/',
}

export const reqGetSpuList = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, SpuListResponseData>(
    API.GET_HASSPU_LIST_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 获取全部品牌的数据
export const reqAllTrademarkList = () =>
  request.get<any, TradeMarkListResponseData>(API.GET_ALL_TRADEMARK_URL)

// 获取某一个SPU下的全部商品图片数据
export const reqSpuImageList = (spuId: number | string) =>
  request.get<any, SpuHasImgResponseData>(API.GET_SPU_IMAGE_URL + `${spuId}`)

// 获取某一个SPU下已有的销售属性
export const reqSpuSaleAttrList = (spuId: number | string) =>
  request.get<any, SaleAttrListResponseData>(
    API.GET_SPU_SALE_ATTR_URL + `${spuId}`,
  )

// 获取全部的销售属性
export const reqAllSaleAttrList = () =>
  request.get<any, AllSaleAttrResponseData>(API.GET_ALL_SALE_ATTR_URL)

// 添加SPU
export const reqAddOrUpdateSpu = (data: SPUData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATE_SPU_URL, data)
  } else {
    return request.post<any, any>(API.ADD_SPU_URL, data)
  }
}

// 添加SKU
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADD_SKU_URL, data)

// 查看SKU列表
export const reqGetSkuList = (spuId: number | string) =>
  request.get<any, SkuListResponseData>(API.GET_SKU_LIST_URL + `${spuId}`)

// 删除SPU
export const reqDeleteSpu = (spuId: number | string) =>
  request.delete<any, any>(API.DELETE_SPU_URL + `${spuId}`)
