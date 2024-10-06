import { createApp } from 'vue'
// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置element-plus国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from '@/App.vue'
// svg入口文件导入
import 'virtual:svg-icons-register'
// 引入全局样式
import '@/styles/index.scss'
import globalComponent from '@/components'
import router from '@/router'
//引入仓库
import pinia from './store'

// 获取应用实例对象
const app = createApp(App)
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn, // element-plus国际化
})

// console.log(import.meta.env) // {BASE_URL: '/', DEV: true, MODE: 'development', PROD: false, SSR: false, …}

// 一个一个注册太麻烦
// import SvgIcon from "@/components/SvgIcon/index.vue"
// app.component('SvgIcon', SvgIcon)
app.use(globalComponent)
//安装仓库
app.use(pinia)
app.use(router)
import './permission'

// // 测试代码，测试接口能否使用
// import axios from "axios"
// // 登录接口
// axios({
//     url: '/api/user/login',
//     method: 'post',
//     data: {
//         username: 'admin',
//         password: '1111112'
//     }
// })
// 将应用挂载到挂载点上
app.mount('#app')
