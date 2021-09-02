import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'IoT Cloud',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'IoT Cloud', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: '产品管理',
    meta: { title: '产品管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: '产品',
        component: () => import('@/views/table/index'),
        meta: { title: '产品', icon: 'table' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: '云音箱',
    meta: {
      title: '云音箱',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu1/device_manage/index'),
        name: '设备监控',
        meta: { title: '设备监控' }
      },
      {
        path: 'device_manage',
        component: () => import('@/views/nested/menu1/device_manage/index'),
        name: '设备管理',
        meta: { title: '设备管理' }
      },
      {
        path: 'device_logs',
        component: () => import('@/views/nested/menu1/device_logs/index'),
        name: '播报日志',
        meta: { title: '播报日志' }
      },
      {
        path: 'device_login',
        component: () => import('@/views/nested/menu1/device_login/index'),
        name: '设备登录日志',
        meta: { title: '设备登录日志' }
      },
      {
        path: 'device_status',
        component: () => import('@/views/nested/menu1/device_status/index'),
        name: '设备上下线日志',
        meta: { title: '设备上下线日志' }
      }
      // ,
      // {
      //   path: 'menu2',
      //   component: () => import('@/views/nested/menu2/index'),
      //   name: '设备调试（农商行）',
      //   meta: { title: '设备调试（农商行）' }
      // },
      // {
      //   path: 'menu2',
      //   component: () => import('@/views/nested/menu2/index'),
      //   name: '设备调试（恒宝）',
      //   meta: { title: '设备调试（恒宝）' }
      // },
      // {
      //   path: 'menu2',
      //   component: () => import('@/views/nested/menu2/index'),
      //   name: '设备调试（黄河银行）',
      //   meta: { title: '设备调试（黄河银行）' }
      // }
    ]
  },
  {
    path: '/OTA',
    component: Layout,
    redirect: '/ota/example',
    name: 'OTA服务器',
    meta: {
      title: 'OTA服务器',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/ota/create-project'),
        name: '项目管理',
        meta: { title: '项目管理', icon: 'edit' }
      },
      {
        path: 'version',
        component: () => import('@/views/ota/ota-project'),
        name: '批次管理',
        meta: { title: '批次管理', icon: 'table' }
      },
      {
        path: 'table',
        component: () => import('@/views/ota/complex-table'),
        name: '分包管理',
        meta: { title: '分包管理', icon: 'list' }
      }
    ]
  },

  {
    path: '/markdown',
    component: Layout,
    redirect: '/markdown/index',
    name: 'API',
    meta: {
      title: 'API',
      icon: 'nested'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/markdown/index'),
        name: 'API',
        meta: { title: 'API', icon: 'edit' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
