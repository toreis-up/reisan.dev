// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'portfolio',
        name: 'Portfolio',
        component: () => import('@/views/Portfolio.vue'),
        meta: {
          showLicense: true,
        },
      },
      {
        path: 'card',
        name: 'Card',
        component: () => import('@/views/Card.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
