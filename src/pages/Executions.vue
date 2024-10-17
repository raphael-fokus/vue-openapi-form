<!-- Executions.vue (Tab 4) -->
<template>
    <div class="executions-container">
      <h1>Executions</h1>
  
      <!-- Execution List Component -->
      <ExecutionList />
  
      <!-- Icon Buttons for navigation -->
      <div class="icon-buttons">
        <!-- Navigation Buttons on the left -->
        <div class="nav-buttons">
          <!-- Navigate to Home Page Button -->
          <button @click="goToHomePage" class="icon-button">
            <i class="fa fa-home"></i>
            <span class="tooltip">Home</span>
          </button>
  
          <!-- Navigate to Workers Page Button -->
          <button @click="goToWorkersPage" class="icon-button">
            <i class="fa fa-users"></i>
            <span class="tooltip">Workers</span>
          </button>
  
          <!-- Navigate to Jobs Page Button -->
          <button @click="goToJobsPage" class="icon-button">
            <i class="fa fa-list"></i>
            <span class="tooltip">Jobs</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ExecutionList from '@/components/ExecutionList.vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Executions',
    components: {
      ExecutionList,
    },
    setup() {
      const router = useRouter();
  
      const goToHomePage = () => {
        router.push({ name: 'Home' });
      };
  
      const goToWorkersPage = () => {
        router.push({ name: 'Workers' });
      };
  
      const goToJobsPage = () => {
        router.push({ name: 'Jobs' });
      };
  
      return {
        goToHomePage,
        goToWorkersPage,
        goToJobsPage,
      };
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
  
  .icon-buttons {
    display: flex;
    justify-content: flex-start; 
    align-items: center;
    margin-top: 20px;
  }
  
  .nav-buttons {
    display: flex;
    gap: 10px; 
  }
  
  .icon-button {
    position: relative;
    background-color: #176bb5;
    border: none;
    color: white;
    padding: 10px;
    font-size: 16px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
  }
  
  .icon-button:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
  
  .tooltip {
    position: absolute;
    top: -35px; 
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
  </style>
  