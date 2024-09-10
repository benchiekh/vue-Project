import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../components/MainLayout.vue'; // Assurez-vous que le chemin est correct
import UserRegister from '../components/UserRegister.vue';
import UserLogin from '../components/UserLogin.vue';
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashboard';
import LandingPage from '../components/LandingPage';

const routes = [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
            path: '/landingpage',
            name: 'LandingPage',
            component: LandingPage,
          },
        {
            path: '/register',
            name: 'Register',
            component: UserRegister,
          },
          {
            path: '/login',
            name: 'Login',
            component: UserLogin,
          },
          {
            path: '/userdashboard',
            name: 'Userdashboard',
            component: UserDashboard,
          },
          {
            path: '/admindashboard',
            name: 'Admindashboard',
            component: AdminDashboard,
          },
          {
            path: '',
            redirect: 'landingpage' 
          }
      ]
    }
  ];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
