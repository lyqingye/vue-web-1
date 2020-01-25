import { asyncRoutes, constantRoutes, componentMap } from '@/router'
import { getRoutes } from '@/api/role'
import {
  getRouterList
} from '@/api/security'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

console.log(Array.from(componentMap.keys()))

function autoImportRouteComponent(rts) {
  rts.forEach(rt => {
    if (rt.meta.icon !== null && rt.meta.icon.startsWith('svg:')) {
      rt.meta.icon = rt.meta.icon.substr(4)
    }
    if (rt.meta.icon !== null && rt.meta.icon.startsWith('el:')) {
      rt.meta.icon = rt.meta.icon.substr(3)
    }
    rt.component = componentMap.get(rt.componentName)
    if (Array.isArray(rt.children)) {
      rt.children = autoImportRouteComponent(rt.children)
    }
  })
  return rts
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      getRouterList().then(resp => {
        let routesFromServe = resp.data
        routesFromServe = autoImportRouteComponent(routesFromServe)
        let accessedRoutes
        accessedRoutes = filterAsyncRoutes(routesFromServe, roles)
        accessedRoutes = accessedRoutes.concat(asyncRoutes)
        console.log(accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
