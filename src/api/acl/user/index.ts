import request from '@/utils/request'
import type { UserListResponseData } from './type'

enum API {
  // 获取用户列表的接口URL
  GET_USER_LIST_URL = '/admin/acl/role/',
}

// 获取用户列表
export const reqGetUserList = (page: number, limit: number) => request.get<any, UserListResponseData>(API.GET_USER_LIST_URL + `${page}/${limit}`)
