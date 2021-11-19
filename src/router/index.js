import Vue from 'vue'
import Router from 'vue-router'
// import Index from '../views/Index'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        hidden: true,
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path:'/lpr',
  //   componentsRouter:Layout,
  //   children: [
  //     {
  //       path: 'hyperlpr',
  //       component: () => import('@/views/lpr/hyperlpr'),
  //       name: 'lpr',
  //       meta: { title: '视频识别', icon: 'el-icon-video-camera', noCache: true }
  //     }
  //   ]
  // },

  {
    path: '/manageacc',
    component: Layout,
    children: [
      {
        path: 'AccManage',
        name: 'AccountManage',
        component: () => import('@/views/manageacc/AccManage'),
        meta: { title: '账户管理', icon: 'el-icon-user', roles: ['admin'] }
      },
      {
        path: 'adduser',
        name: 'AddUser',
        component: () => import('@/views/manageacc/AddUser'),
        meta: { title: '添加用户', icon: 'el-icon-user', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/manageacc/updateuser',
        name: 'updateuser',
        component: () => import('@/views/manageacc/UpdateUser'),
        meta: { title: '更新用户', icon: 'el-icon-user', roles: ['admin'] },
        hidden: true
      }
    ]
  },

  {
    path: '/managecar',
    component: Layout,
    children: [
      {
        path: 'carmanage',
        name: 'CarManage',
        component: () => import('@/views/managecar/CarManager'),
        meta: { title: '车辆管理', icon: 'car', roles: ['admin'] }
      },
      {
        path: '/managecar/addcar',
        name: 'addcar',
        component: () => import('@/views/managecar/AddCar'),
        meta: { title: '添加车辆', icon: 'car', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/managecar/updatecar',
        name: 'updatecar',
        component: () => import('@/views/managecar/UpdateCar'),
        meta: { title: '更新车辆', icon: 'car', roles: ['admin'] },
        hidden: true
      }
    ]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage',
    name: 'parkrecord',
    meta: {
      title: '停车场管理',
      icon: 'parking_lot',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: '/manage/parkrecordmanage',
        name: 'parkrecord',
        component: () => import('@/views/manage/ParkRecordManager'),
        meta: { title: '停车记录管理', icon: 'record', roles: ['admin'] }
      },
      {
        path: '/manage/parkspace',
        name: 'parkingspacemanage',
        component: () => import('@/views/manage/ParkSpace'),
        meta: { title: '场内车辆管理', icon: 'park', roles: ['admin'] }
      },
      {
        path: '/managefin/finance',
        name: 'finance',
        component: () => import('@/views/managefin/Finance'),
        meta: { title: '财务信息管理', icon: 'finance', roles: ['admin'] }
      },
      {
        path: '/manage/addparkrecord',
        name: 'addparkrecord',
        component: () => import('@/views/manage/AddParkRecord'),
        meta: { title: '添加停车记录', icon: 'record', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/manage/updateparkrecord',
        name: 'updateparkrecord',
        component: () => import('@/views/manage/UpdateParkRecord'),
        meta: { title: '更新停车记录', icon: 'record', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/manage/updatefare',
        name: 'updateparkrecord',
        component: () => import('@/views/manage/UpdateFare'),
        meta: { title: '只更新停车记录扣费', icon: 'record', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/manage/addparking',
        name: 'addparking',
        component: () => import('@/views/manage/AddParking'),
        meta: { title: '增加进场车辆', icon: 'record', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/managefin/UpdatePay',
        name: 'UpdatePay',
        component: () => import('@/views/managefin/UpdatePay'),
        meta: { title: '修改缴费信息', icon: 'money', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/managefin/AddPay',
        name: 'AddPay',
        component: () => import('@/views/managefin/AddPay'),
        meta: { title: '添加缴费信息', icon: 'money', roles: ['admin'] },
        hidden: true
      }
    ]
  },
  {
    path: '/lpr',
    component: Layout,
    redirect: 'noRedirect',
    name: 'LPR',
    meta: {
      title: 'lpr',
      icon: 'el-icon-video-camera',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'hyperlpr',
        // component:
        component: () => import('@/views/lpr/hyperlpr'),
        name: 'lpr',
        meta: { title: '系统监控', noCache: true }
      }
    ]
  },
  {
    path: '/feedback',
    component: Layout,
    children: [
      {
        path: '/feedback',
        component: () => import('@/views/feedback/Feedback'),
        name: 'feedback',
        meta: { title: '问题反馈', icon: 'el-icon-chat-line-square', noCache: true }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    // alwaysShow: true, // will always show the root menu
    hidden: true,
    name: 'Permission',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/icon',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  {
    path: '/example',
    hidden: true,
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    hidden: true,
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    hidden: true,
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: {
          title: 'exportExcel',
          roles: ['admin']
        }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    hidden: true,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'exportZip' }
      }
    ]
  },

  {
    path: '/theme',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard' }
      }
    ]
  },

  {
    path: '/i18n',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/i18n-demo/index'),
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international' }
      }
    ]
  },

  {
    path: 'external-link',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link' }
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
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher // reset router
}

export default router
