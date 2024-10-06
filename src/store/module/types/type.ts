import { RouteRecordRaw } from 'vue-router'

//定义小仓库数据state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[] // 路由对象数组
  username: string
  avatar: string
}
