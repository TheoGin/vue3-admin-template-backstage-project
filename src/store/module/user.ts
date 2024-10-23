import { defineStore } from 'pinia'
import { reqLogin, reqLogout } from '@/api/user'
import type {
  LoginResponceData,
  LoginFormData,
  UserInfoResponceData,
} from '@/api/user/type'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { constantRoutes } from '@/router/routes'
import { reqUserInfo } from '@/api/user'
let useUserStore = defineStore('user', {
  //小仓库存储数据地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoutes, // 仓库存储生成菜单需要数组（路由）
      username: '',
      avatar: '',
    }
  },
  //异步|逻辑的地方
  actions: {
    async userLogin(data: any) {
      this.token = 'Admin Token'
      //本地存储持久化存储一份
      SET_TOKEN('Admin Token' as string)
      //能保证当前async函数返回一个成功的promise
      return 'ok'
    },
    async userInfo() {
      this.username = 'admin'
      this.avatar =
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
      return 'ok'
    },
    // async userLogin(loginForm: LoginFormData) {
    //   const res: LoginResponceData = await reqLogin(loginForm)
    //   console.log(res);
    //   if (res.code === 200) {
    //     this.token = res.data as string
    //     SET_TOKEN(res.data as string)
    //     return 'ok'
    //   } else {
    //     return Promise.reject(new Error(res.data))
    //   }
    // },
    // // 获取用户信息，如头像、用户名
    // async userInfo() {
    //   const res: UserInfoResponceData = await reqUserInfo()
    //   console.log(res)
    //   if (res.code === 200) {
    //     this.username = res.data.name
    //     this.avatar = res.data.avatar
    //     return 'ok'
    //   } else {
    //     return Promise.reject(new Error(res.message))
    //   }
    // },
    // 退出登录
    async userLogout() {
      //退出登录请求
      const res: any = await reqLogout()
      // console.log(res);
      if (res.code === 200) {
        //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
        this.token = ''
        REMOVE_TOKEN()
        this.username = ''
        this.avatar = ''
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },

    // async userLogin(loginForm: LoginFormData) {
    //   const res: LoginResponceData = await reqLogin(loginForm)
    //   // console.log(res);
    //   if (res.code === 200) {
    //     this.token = res.data.token as string
    //     SET_TOKEN(res.data.token as string)
    //     return 'ok'
    //   } else {
    //     return Promise.reject(new Error(res.data.message))
    //   }
    // },
    // // 获取用户信息，如头像、用户名
    // async userInfo() {
    //   const res = await reqUserInfo()
    //   console.log(res)
    //   if (res.code === 200) {
    //     this.username = res.data.checkUser.username
    //     this.avatar = res.data.checkUser.avatar
    //     return 'ok'
    //   } else {
    //     return Promise.reject('获取用户信息失败！')
    //   }
    // },
    // // 退出登录
    // userLogout() {
    //   this.token = ''
    //   REMOVE_TOKEN()
    //   this.username = ''
    //   this.avatar = ''
    // },
  },
  getters: {},
})

export default useUserStore
