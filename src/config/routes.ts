import AboutPage from '@/pages/about'
import HomePage from '@/pages/index'
import LoginPage from '@/pages/login'

export interface RouteItem {
  path: string
  auth?: boolean
  exact?: boolean
  hideInMenu?: boolean
  meta?: Record<string, any>
  children?: RouteItem[]
  icon?: any
  component?: any
  name?: string
  hideInRoute?: boolean
}
export type RouteConfig = RouteItem[]

const routes: RouteConfig = [
  {
    path: '/',
    auth: true,
    name: '管理',
    children: [
      {
        path: '/home',
        name: '首页',
        component: HomePage,
      },
      {
        path: '/about',
        name: '关于',
        component: AboutPage,
      },
    ],
  },
  {
    path: '/login',
    component: LoginPage,
    hideInMenu: true,
  },
]

export default routes
