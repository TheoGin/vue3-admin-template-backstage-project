export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'), // 动态路由懒加载
    name: 'login', // 取名路由方便做动态路由
    meta: {
      title: '登录', // 菜单标题
      hidden: true, // 代表路由标题在菜单中是否隐藏    true:隐藏false:不隐藏
      icon: 'UserFilled',
    },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: true,
      icon: 'Plus',
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
      // {
      //     path: '/test',
      //     component: () => import('@/views/home/index.vue'),
      //     name: 'test',
      //     meta: {
      //         title: '测试',
      //         hidden: true,
      //         icon: 'DataBoard'
      //     },
      // },
    ],
  },
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',
    meta: {
      title: '数据大屏',
      icon: 'Monitor',
    },
  },
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    meta: {
      title: '权限管理',
      icon: 'Lock',
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/index.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          icon: 'Grid',
        },
      },
    ],
  },
  {
    path: '/goods',
    component: () => import('@/layout/index.vue'),
    name: 'Goods',
    meta: {
      title: '商品管理',
      icon: 'ShoppingCartFull',
    },
    redirect: '/goods/trademark',
    children: [
      {
        path: '/goods/trademark',
        component: () => import('@/views/goods/trademark/index.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          icon: 'Notebook',
        },
      },
      {
        path: '/goods/attr',
        component: () => import('@/views/goods/attr/index.vue'),
        name: 'Attr',
        meta: {
          title: '属性管理',
          icon: 'TrendCharts',
        },
      },
      {
        path: '/goods/spu',
        component: () => import('@/views/goods/spu/index.vue'),
        name: 'Spu',
        meta: {
          title: 'SPU管理',
          icon: 'Coordinate',
        },
      },
      {
        path: '/goods/sku',
        component: () => import('@/views/goods/sku/index.vue'),
        name: 'Sku',
        meta: {
          title: 'SKU管理',
          icon: 'Present',
        },
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'CloseBold',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'Rank',
    },
  },
]