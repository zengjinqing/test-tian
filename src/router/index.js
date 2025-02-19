import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'index',
      path: '/index',
      component: () => import('@/view/index/index.vue'),
      children: [
        {
          name: 'robot',
          path: '/robot',
          component: () => import('@/view/index/components/Lei/robot/robot.vue'),
        },
        {
          name: 'zengIndex',
          path: '/zengIndex',
          component: () => import('@/view/index/components/Lei/robot/robot.vue'),
        },
        {
          name: 'jsonheatmap',
          path: '/jsonheatmap',
          component: () => import('@/view/index/components/Lei/jsonheatmap/jsonheatmap.vue'),
        },
        {
          name: 'workertest',
          path: '/workertest',
          component: () => import('@/view/index/components/Lei/workertest/workertest.vue'),
        },
        {
          name: 'latlon',
          path: '/latlon',
          component: () => import('@/view/index/components/Lei/latlon/latlon.vue'),
        }
      ]
    },
    {
      path: '/:(.*)',
      redirect: {
        name: "index"
      }
    }
  ]
})


export default router;