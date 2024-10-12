//统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import { LoginFormData, LoginResponceData, UserInfoResponceData } from './type'

//项目用户相关的请求地址
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout'
}

//登录接口
export const reqLogin = (data: LoginFormData) => request.post<any, LoginResponceData>(API.LOGIN_URL, data)

//获取用户信息
// 第一个 any: 代表请求参数的类型。第二个 any: 代表响应数据的类型。
export const reqUserInfo = () => request.get<any, UserInfoResponceData>(API.USERINFO_URL)

//退出登录接口
export const reqLogout = () => request.post<any,any>(API.LOGOUT_URL)

// import type {
//   LoginFormData,
//   LoginResponceData,
//   UserInfoResponceData,
// } from './type'

// //项目用户相关的请求地址
// enum API {
//   LOGIN_URL = '/user/login',
//   USERINFO_URL = '/user/info',
// }

// //登录接口
// export const reqLogin = (data: LoginFormData) =>
//   request.post<any, LoginResponceData>(API.LOGIN_URL, data)

// //获取用户信息
// export const reqUserInfo = () => {
//   return request.get<any, UserInfoResponceData>(API.USERINFO_URL)
// }
