<template>
    <div class="executions-container">
      <h1>Current & Past Executions</h1>
  
      <!-- Execution List Component -->
      <ExecutionList />
    </div>
  </template>
  
  <script>
  import ExecutionList from '@/components/ExecutionList.vue';
  
  export default {
    name: 'Executions',
    components: {
      ExecutionList,
    },
  };
  </script>
  
  <style scoped>
  .executions-container {
    margin: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  