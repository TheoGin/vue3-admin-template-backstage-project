//定义用户相关数据的ts类型
//用户登录接口携带参数的ts类型
export interface LoginFormData {
  username: string
  password: string
}

interface DataType {
  token?: string
  message?: string
}

//定义登录接口返回数据类型
export interface LoginResponceData {
  code: number
  data: DataType
}

interface UserInfo {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}

interface UserInfoData {
  checkUser: UserInfo
}

//定义获取用户信息返回数据类型
export interface UserInfoResponceData {
  code: number
  data: UserInfoData
}
