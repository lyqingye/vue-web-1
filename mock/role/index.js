import Mock from 'mockjs'
import {
  deepClone
} from '../../src/utils/index.js'
import {
  asyncRoutes,
  constantRoutes
} from './routes.js'

const routes = [{
  path: '/permission',
  alwaysShow: true, // will always show the root menu
  name: 'Permission',
  componentName: 'layout',
  meta: {
    title: 'Permission',
    icon: 'lock',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [{
    path: 'page',
    componentName: 'views-permission-page',
    name: 'PagePermission',
    meta: {
      title: 'Page Permission',
      roles: ['admin']
    }
  }]
}]

export default [
  // mock get all routes form server
  {
    url: '/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: routes
      }
    }
  },

  // mock get all roles form server
  {
    url: '/roles',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: roles
      }
    }
  },

  // add role
  {
    url: '/role',
    type: 'post',
    response: {
      code: 20000,
      data: {
        key: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update role
  {
    url: '/role/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // delete role
  {
    url: '/role/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
]
