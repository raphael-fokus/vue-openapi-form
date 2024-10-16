import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue'; 
import JobListingPage from '@/pages/Jobs.vue'; 
import ExecutionListPage from '@/pages/Executions.vue'; 
import WorkersPage from '@/pages/Workers.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, 
  },
  {
    path: '/jobs',
    name: 'JobListing',
    component: JobListingPage, 
  },
  {
    path: '/workers',
    name: 'Workers',
    component: WorkersPage, 
  },
  {
    path: '/executions',
    name: 'ExecutionList',
    component: ExecutionListPage, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
