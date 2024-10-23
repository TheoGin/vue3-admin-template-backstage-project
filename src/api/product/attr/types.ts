export interface ResponceData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

export interface CategoryResponceData extends ResponceData {
  data: CategoryObj[]
}

// 属性ts类型
export interface AttrValue {
  id?: number
  valueName: number
  attrId?: number
  isInput?: boolean
}

export type AttrValueList = AttrValue[]

export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}

export type AttrList = Attr[]

export interface AttrResponceData extends ResponceData {
  data: AttrList
}
