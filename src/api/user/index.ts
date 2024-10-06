//统一管理咱们项目用户相关的接口

import request from '@/utils/request'
import type {
  LoginFormData,
  LoginResponceData,
  UserInfoResponceData,
} from './type'

//项目用户相关的请求地址
enum API {
  LOGIN_URL = '/user/login',
  USERINFO_URL = '/user/info',
}

//登录接口
export const reqLogin = (data: LoginFormData) =>
  request.post<any, LoginResponceData>(API.LOGIN_URL, data)

//获取用户信息
export const reqUserInfo = () => {
  return request.get<any, UserInfoResponceData>(API.USERINFO_URL)
}
