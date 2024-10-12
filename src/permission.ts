//路由鉴权:鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from '@/router'
// @ts-ignore
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// Turn off loading spinner by setting it to false. (default: true)
nprogress.configure({ showSpinner: false })

//获取小仓库前得先引入大仓库
import useUserStore from './store/module/user'
import pinia from './store'
import setting from './setting'

const userStore = useUserStore(pinia)
// console.log(userStore.token);

//全局守卫:项目当中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.logoTitle} - ${to.meta.title}`

  // 进度条开始
  nprogress.start()

  //获取token,去判断用户登录、还是未登录
  let token = userStore.token

  //获取用户名字
  let username = userStore.username
  // console.log(username)
  //用户登录成功: 不可以访问login[指向首页],其余的路由可以访问
  if (token) {
    //登录成功,访问login,不能访问,指向首页
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      //登录成功访问其余六个路由(登录排除)
      //有用户信息
      if (username) {
        //放行
        next()
      } else {
        try {
          //获取用户信息
          const res = await userStore.userInfo()
          // console.log(res)
          // console.log(111)
          //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
          next({ ...to })
        } catch (error) {
          //token过期:获取不到用户信息了
          //用户手动修改本地存储token
          //退出登录->用户相关的数据清空
          useUserStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //用户未登录: 可以访问login,其余六个路由不能访问(指向login)
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
//全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

//第一个问题:任意路由切换实现进度条业务 ---nprogress
//第二个问题:路由鉴权(路由组件访问权限的设置)
//全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

//用户未登录:可以访问login,其余六个路由不能访问(指向login)
//用户登录成功:不可以访问login[指向首页],其余的路由可以访问
