import { createRouter, createWebHistory } from 'vue-router';
import VueOpenapiForm from '@/components/VueOpenapiForm.vue';
import JobListingPage from '@/components/JobListingPage.vue'; 
import ExecutionListPage from '@/components/ExecutionListPage.vue'; 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: VueOpenapiForm, 
  },
  {
    path: '/jobs',
    name: 'JobListing',
    component: JobListingPage, 
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
