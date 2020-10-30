import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/Dashboard';
import Login from '@/components/pages/Login';
import Products from '@/components/pages/Products';
import Coupons from '@/components/pages/Coupons';
import CustomerOrder from '@/components/pages/CustomerOrders';
import CustomerCheckout from '@/components/pages/CustomerCheckout';
import Orders from '@/components/pages/Orders';



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/login',
    },
    {
      path: '/login',   // 路徑要打小寫
      name: 'Login',
      component: Login, // 指向元件 Login.vue
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      // meta: { requiresAuth: true }, 
      children: [
        {
          path: 'products',   // 路徑要打小寫
          name: 'Products',
          component: Products, // 指向元件 Products.vue
          meta: { requiresAuth: true }, 
         // 確保進入頁面之前，需要被驗證
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true },
        },
      ]
    },
    {
      path: '/',   // 不用掛在admin下
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'customer_order',   // 路徑要打小寫
          name: 'CustomerOrder',
          component: CustomerOrder, // 指向元件 CustomerOrders.vue
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout,
        },
      ]
    },
  ]
})
