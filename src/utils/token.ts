//封装本地存储存储数据与读取数据方法
//存储数据
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
//本地存储获取数据
export const GET_TOKEN = (token: string) => {
  return localStorage.getItem('TOKEN')
}

// 本地删除token
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}
