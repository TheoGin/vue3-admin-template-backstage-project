// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
// 全局引入ElementPlus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局对象
const allGlobalComponents = { SvgIcon, Pagination }
// console.log(allComponents);
/**
{
    "SvgIcon": {...},
    "Pagination": {...}
}
 */
// 对外暴露插件对象
export default {
  // 务必安装install方法
  install(app) {
    // console.log(app)
    // console.log(Object.keys(allComponents)); // ['SvgIcon', 'Pagination']
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponents).forEach((key) => {
      // 注册项目全部的全局组件
      app.component(key, allGlobalComponents[key])
    })

    // 全局注册ElementPlus图标
    // console.log(Object.entries(ElementPlusIconsVue));
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
