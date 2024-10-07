<template>
  <div class="job-listing-container">
    <h1>Jobs & Scheduling</h1>
    <job-list @schedule-job="scheduleJob" />

    <!-- Scheduling Area -->
    <scheduling-area v-if="selectedJob" :selected-job="selectedJob" @cancel-schedule="cancelSchedule"
      @execute-job="executeJob" />

    <!-- WorkerList to show connected and registered workers -->
    <worker-list />

    <!-- Icon buttons for worker registration and executions -->
    <div class="icon-buttons">
      <!-- Worker Registration Toggle Button -->
      <button @click="toggleWorkerRegistration" class="icon-button">
        <i class="fa fa-user-plus"></i>
        <span class="tooltip">Register Worker</span>
      </button>

      <!-- Execution List Button -->
      <button @click="goToExecutionList" class="icon-button">
        <i class="fa fa-arrow-right"></i>
        <span class="tooltip">Current/Past Executions</span>
      </button>
    </div>

    <!-- Worker Registration Component, conditionally visible -->
    <WorkerRegistration v-if="isWorkerRegistrationVisible" @close="toggleWorkerRegistration" />
  </div>
</template>

<script>
import JobList from './JobList.vue';
import SchedulingArea from './SchedulingArea.vue';
import WorkerList from './WorkerList.vue';
import WorkerRegistration from './WorkerRegistration.vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    JobList,
    SchedulingArea,
    WorkerList,
    WorkerRegistration,
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const store = useStore();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const selectedJob = ref(null);
    const isWorkerRegistrationVisible = ref(false);

    const goToExecutionList = () => {
      router.push({ name: 'ExecutionList' });
    };

    const toggleWorkerRegistration = () => {
      isWorkerRegistrationVisible.value = !isWorkerRegistrationVisible.value;
    };

    const scheduleJob = (job) => {
      selectedJob.value = job;
    };

    const cancelSchedule = () => {
      selectedJob.value = null;
    };

    const executeJob = async (scheduleData) => {
      let { scheduledDate } = scheduleData;
      if (!scheduledDate) {
        scheduledDate = new Date().toISOString();
      } else if (scheduledDate instanceof Date) {
        scheduledDate = scheduledDate.toISOString();
      }

      const payload = {
        job: selectedJob.value,
        scheduledDate: scheduledDate,
      };

      try {
        const response = await axios.post(`${baseUrl}/v1/execution`, payload);
        console.log('Job executed successfully:', response.data);
        toast.success('Job scheduled successfully');
        selectedJob.value = null;
      } catch (error) {
        console.error('Error executing job:', error);
        toast.error('Failed to execute job. Please try again.');
      }
    };

    return {
      selectedJob,
      isWorkerRegistrationVisible,
      goToExecutionList,
      toggleWorkerRegistration,
      scheduleJob,
      cancelSchedule,
      executeJob,
    };
  },
};
</script>

<style scoped>
.job-listing-container {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.icon-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
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
  top: -30px;
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}
</style>
