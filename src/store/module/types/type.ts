import { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'

//定义小仓库数据state返回类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[] // 路由对象数组
  username: string
  avatar: string
}

// 分类仓库的state返回类型
export interface CategoryState {
  category1Arr: CategoryObj[],
  c1Id: number | string,
  category2Arr: CategoryObj[],
  c2Id: number | string,
  category3Arr: CategoryObj[],
  c3Id: number | string,
}