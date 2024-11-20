// 定义通用返回数据类型
interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义用户列表数据类型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username?: string
  password?: string
  name?: string
  phone: null
  roleName: string
}

// 定义用户列表返回数据类型
export type UserListResponseData = ResponseData & {
  data: {
    records: User[]
    total: number
    size: number
    current: number
    pages: number
  }
}
