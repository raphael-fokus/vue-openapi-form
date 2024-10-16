<template>
    <div class="workers-container">
      <h1>Worker Management</h1>
  
      <!-- Worker List Component -->
      <WorkerList />
  
      <!-- Worker Registration Component, optional -->
      <WorkerRegistration
        v-if="isWorkerRegistrationVisible"
        @close="toggleWorkerRegistration"
        @worker-registered="refreshWorkers"
      />
  
      <!-- Button zum Öffnen der Worker Registration -->
      <div class="worker-actions">
        <button @click="toggleWorkerRegistration" class="button is-primary">
          <i class="fa fa-user-plus"></i> Register Worker
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import WorkerList from '@/components/WorkerList.vue';
  import WorkerRegistration from '@/components/WorkerRegistration.vue';
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useToast } from 'vue-toastification';
  
  export default {
    name: 'Workers',
    components: {
      WorkerList,
      WorkerRegistration,
    },
    setup() {
      const store = useStore();
      const toast = useToast();
  
      const isWorkerRegistrationVisible = ref(false);
  
      const toggleWorkerRegistration = () => {
        isWorkerRegistrationVisible.value = !isWorkerRegistrationVisible.value;
      };
  
      const refreshWorkers = () => {
        store.dispatch('fetchWorkers').then(() => {
          toast.success('Workers refreshed successfully.');
        });
      };
  
      return {
        isWorkerRegistrationVisible,
        toggleWorkerRegistration,
        refreshWorkers,
      };
    },
  };
  </script>
  
  <style scoped>
  .workers-container {
    margin: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .worker-actions {
    margin-top: 20px;
  }
  </style>
  