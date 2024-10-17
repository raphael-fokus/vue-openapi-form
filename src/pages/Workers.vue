<template>
  <div class="workers-container">
    <h1>Worker Management</h1>

    <!-- Worker List Component -->
    <WorkerList />

    <!-- Worker Registration Component -->
    <WorkerRegistration
      v-if="isWorkerRegistrationVisible"
      @close="toggleWorkerRegistration"
      @worker-registered="refreshWorkers"
    />

    <!-- Icon Buttons for navigation -->
    <div class="icon-buttons">
      <!-- Left-aligned Home Navigation Button -->
      <button @click="goToHomePage" class="icon-button">
        <i class="fa fa-home"></i>
        <span class="tooltip">Home</span>
      </button>

      <!-- Centered Worker Registration Button -->
      <button @click="toggleWorkerRegistration" class="icon-button">
        <i class="fa fa-user-plus"></i>
        <span class="tooltip">Register Worker</span>
      </button>

      <!-- Right-aligned Navigation Buttons -->
      <div class="nav-buttons">
        <!-- Navigate to Jobs Page Button -->
        <button @click="goToJobsPage" class="icon-button">
          <i class="fa fa-list"></i>
          <span class="tooltip">Jobs</span>
        </button>

        <!-- Navigate to Executions Page Button -->
        <button @click="goToExecutionsPage" class="icon-button">
          <i class="fa fa-play"></i>
          <span class="tooltip">Executions</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import WorkerList from '@/components/WorkerList.vue';
import WorkerRegistration from '@/components/WorkerRegistration.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
  name: 'Workers',
  components: {
    WorkerList,
    WorkerRegistration,
  },
  setup() {
    const store = useStore();
    const toast = useToast();
    const router = useRouter();

    const isWorkerRegistrationVisible = ref(false);

    const toggleWorkerRegistration = () => {
      isWorkerRegistrationVisible.value = !isWorkerRegistrationVisible.value;
    };

    const refreshWorkers = () => {
      store.dispatch('fetchWorkers').then(() => {
        toast.success('Workers refreshed successfully.');
      });
    };

    const goToHomePage = () => {
      router.push({ name: 'Home' });
    };

    const goToJobsPage = () => {
      router.push({ name: 'Jobs' });
    };

    const goToExecutionsPage = () => {
      router.push({ name: 'Executions' });
    };

    return {
      isWorkerRegistrationVisible,
      toggleWorkerRegistration,
      refreshWorkers,
      goToHomePage,
      goToJobsPage,
      goToExecutionsPage,
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

.icon-buttons {
  position: relative; /* Added for absolute positioning of the centered button */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

/* Center the Worker Registration button */
.icon-buttons > .icon-button:nth-child(2) {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* Navigation buttons container on the right */
.nav-buttons {
  display: flex;
  gap: 10px;
}

/* Individual button styles */
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
