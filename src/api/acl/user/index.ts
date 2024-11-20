import request from '@/utils/request'
import type { UserListResponseData, User } from './type'

enum API {
  // 获取用户列表的接口URL
  GET_USER_LIST_URL = '/admin/acl/user/',
  // 添加用户的接口URL
  ADD_USER_URL = '/admin/acl/user/save',
  // 更新用户的接口URL
  UPDATE_USER_URL = '/admin/acl/user/update',
}

// 获取用户列表
export const reqGetUserList = (page: number, limit: number) => request.get<any, UserListResponseData>(API.GET_USER_LIST_URL + `${page}/${limit}`)

// 添加用户或更新用户
export const reqAddOrUpdateUser = (data: User) => {
  // 判断是否存在id，如果存在则更新，否则添加
  if(data.id) {
    // 更新用户
    return request.put<any, any>(API.UPDATE_USER_URL, data)
  } else {
    // 添加用户
    return request.post<any, any>(API.ADD_USER_URL, data)
  }
}
