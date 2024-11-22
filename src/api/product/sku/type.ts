// 定义接口返回的数据类型
interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SKU平台属性值对象ts类型
export interface SkuAttrValue {
  attrId: number | string // 平台属性ID
  valueId: number | string // 平台属性值ID
}

// SKU销售属性值对象ts类型
export interface SkuSaleAttrValue {
  saleAttrId: number | string // 销售属性ID
  saleAttrValueId: number | string // 销售属性值ID
}

//已有的销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: string
}

// SKU数据类型
export interface SkuData {
  category3Id: number | string // 三级分类ID
  spuId: number | string // SPU的ID
  tmId: number | string // 品牌ID
  skuName: string // SKU名称
  price: number | string // 价格
  weight: number | string // 重量
  skuDesc: string // SKU描述
  skuAttrValueList: SkuAttrValue[] // 平台属性值列表
  skuSaleAttrValueList: SkuSaleAttrValue[] // 销售属性值列表
  skuDefaultImg: string // SKU默认图片
  id?: number // SKU的ID
  isSale?: number // 是否上架
}
// 已有的销售属性值的列表ts类型
export type SaleAttrValueList = SaleAttrValue[]

//销售属性对象ts类型
export interface SaleAttr {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  saleAttrValueList: SaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

// 获取SKU列表接口返回数据ts类型
export interface SkuListResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 获取SKU商品信息接口返回数据ts类型
export interface SkuInfoResponseData extends ResponseData {
  data: SkuData
}
