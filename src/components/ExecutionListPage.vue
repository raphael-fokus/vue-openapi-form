<template>
    <div>
      <h1>Execution List</h1>
      <execution-list />
  
      <button @click="goToJobListing" class="button is-primary mt-20">Go to Job Listing & Scheduling</button>
    </div>
  </template>
  
  <script>
  import ExecutionList from './ExecutionList.vue';
  import { useRouter } from 'vue-router';
  
  export default {
    components: {
      ExecutionList
    },
    setup() {
      const router = useRouter();
  
      const goToJobListing = () => {
        router.push({ name: 'JobListing' });
      };
  
      return {
        goToJobListing
      };
    }
  };
  </script>
  
  <style scoped>
  /* Add custom styling here */
  </style>
  