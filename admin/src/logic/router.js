import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/admin',
    component: () => import('@/views/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: 'users',
        component: () => import('@/views/Users.vue')
      },
      {
        path: 'config',
        component: () => import('@/views/Config.vue')
      },
      {
        path: 'types',
        component: () => import('@/views/Types.vue')
      },
      {
        path: 'types/:type',
        component: () => import('@/views/Type.vue'),
        props: true
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/await',
    component: () => import('@/views/Await.vue')
  },
  {
    path: '/setup',
    component: () => import('@/views/Setup.vue')
  },
  {
    path: '/logout',
    component: {}
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/admin'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default {
  install(app) {
    app.$router = router
    router.install(app)
    router.beforeEach(async to => {
      let authenticated = localStorage.getItem('user')
      let ready = localStorage.getItem('ready')

      try {
        await app?.$io?.reAuthenticate()
      } catch(e) {
        authenticated = false
        localStorage.setItem('user', null)
      }
      ready = ready === null ? ready : JSON.parse(ready)
    
      if (['/logout'].includes(to.path)) {
        app.$io.logout()
        localStorage.removeItem('user')
        return '/login'
      }

      if (!['/await', '/setup', '/login'].includes(to.path) && (!ready || !authenticated)) {
        localStorage.setItem('history', to.path)
      }
    
      if (!['/await'].includes(to.path) && ready === null) return '/await'
      if (!['/setup'].includes(to.path) && ready === false) return '/setup'
      if (!['/login'].includes(to.path) && ready && !authenticated) return '/login'
    
      if (['/await'].includes(to.path) && ready) return '/login'
      if (['/setup'].includes(to.path) && ready) return '/login'
      if (['/login'].includes(to.path) && ready && authenticated) return '/admin'
    
    })
  }
}