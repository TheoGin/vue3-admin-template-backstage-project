
export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}

// 已有的SPUData数据ts类型：需要修改
export interface SPUData {
    category3Id: number | string,
    id?: number,
    spuName: string,
    tmId: number | string,
    description: string,
    spuImageList: null | SpuImage[],
    spuSaleAttrList: null | SaleAttr[],
}

export type Records = SPUData[];

export interface SpuListResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number,
    }
}

export interface TradeMark {
  id?: number;
  tmName: string;
  logoUrl: string;
}

export type AllTradeMarkList = TradeMark[];

export interface TradeMarkListResponseData extends ResponseData {
  data: AllTradeMarkList;
}

export interface SpuImage {
  id?: number;
  imgName?: string;
  imgUrl?: string;
  createTime?: string;
  updateTime?: string;
  spuId?: number;
  name?: string;
  url?: string;
}

export type SpuImageList = SpuImage[];

export interface SpuHasImgResponseData extends ResponseData {
  data: SpuImageList;
}

export type SaleAttrList = SaleAttr[];  

//已有的销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number;
  createTime?: string;
  updateTime?: string;
  spuId?: number;
  baseSaleAttrId: number | string;
  saleAttrValueName: string;
  saleAttrName?: string;
  isChecked?: string;
}

// 已有的销售属性值的列表ts类型
export type SaleAttrValueList = SaleAttrValue[];


//销售属性对象ts类型
export interface SaleAttr {
  id?: number;
  createTime?: string;
  updateTime?: string;
  spuId?: number;
  baseSaleAttrId: number | string;
  saleAttrName: string;
  saleAttrValueList: SaleAttrValueList;
  flag?: boolean;
  saleAttrValue?: string;
}


//SPU已有的销售属性接口返回数据ts类型
export interface SaleAttrListResponseData extends ResponseData {
  data: SaleAttr[];
}

//已有的全部SPU的返回数据ts类型
export interface HasSaleAttr {
  id: number; 
  name: string;
}


// 全部销售属性接口返回数据ts类型
export interface AllSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[];
}

// SKU平台属性值对象ts类型
export interface SkuAttrValue {
  attrId: number | string; // 平台属性ID
  valueId: number | string; // 平台属性值ID
}

// SKU销售属性值对象ts类型
export interface SkuSaleAttrValue {
  saleAttrId: number | string; // 销售属性ID
  saleAttrValueId: number | string; // 销售属性值ID
}

// SKU数据类型
export interface SkuData {
    category3Id: number | string, // 三级分类ID
    spuId: number | string, // SPU的ID
    tmId: number | string, // 品牌ID
    skuName: string, // SKU名称
    price: number | string, // 价格
    weight: number | string, // 重量
    skuDesc: string, // SKU描述
    skuAttrValueList: SkuAttrValue[], // 平台属性值列表
    skuSaleAttrValueList: SkuSaleAttrValue[], // 销售属性值列表
    skuDefaultImg: string, // SKU默认图片
}

// SKU列表接口返回数据ts类型
export interface SkuListResponseData extends ResponseData {
  data: SkuData[];
}

