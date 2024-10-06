import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user'
import type { LoginFormData } from '@/api/user/type'
import type { LoginResponceData } from '@/api/user/type'
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
    async userLogin(loginForm: LoginFormData) {
      const res: LoginResponceData = await reqLogin(loginForm)
      // console.log(res);
      if (res.code === 200) {
        this.token = res.data.token as string
        SET_TOKEN(res.data.token as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data.message))
      }
    },
    // 获取用户信息，如头像、用户名
    async userInfo() {
      const res = await reqUserInfo()
      console.log(res)
      if (res.code === 200) {
        this.username = res.data.checkUser.username
        this.avatar = res.data.checkUser.avatar
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败！')
      }
    },
    // 退出登录
    userLogout() {
      this.token = ''
      REMOVE_TOKEN()
      this.username = ''
      this.avatar = ''
    },
  },
  getters: {},
})

export default useUserStore
