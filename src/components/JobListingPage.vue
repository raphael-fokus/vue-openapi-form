<template>
  <div class="job-listing-container">
    <h1>Jobs & Scheduling</h1>
    <job-list @schedule-job="scheduleJob" />

    <!-- Scheduling Area with WorkerList embedded within it -->
    <scheduling-area v-if="selectedJob" :selected-job="selectedJob" :available-workers="availableWorkers" @cancel-schedule="cancelSchedule" @execute-job="executeJob" />

    <!-- WorkerList to show connected and registered workers -->
    <worker-list @update-workers="updateAvailableWorkers" />

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

export default {
  components: {
    JobList,
    SchedulingArea,
    WorkerList,
    WorkerRegistration,
  },
  data() {
    return {
      selectedJob: null,
      availableWorkers: [],
      isWorkerRegistrationVisible: false,
      baseUrl: import.meta.env.VITE_BASE_URL,
    };
  },
  setup() {
    const router = useRouter();
    const toast = useToast();

    const goToExecutionList = () => {
      router.push({ name: 'ExecutionList' });
    };

    return {
      goToExecutionList,
      toast,
    };
  },
  methods: {
    toggleWorkerRegistration() {
      this.isWorkerRegistrationVisible = !this.isWorkerRegistrationVisible;
    },
    scheduleJob(job) {
      this.selectedJob = job;
    },
    cancelSchedule() {
      this.selectedJob = null;
    },
    updateAvailableWorkers(workers) {
      this.availableWorkers = workers;
    },
    async executeJob(scheduleData) {
      let { scheduledDate } = scheduleData;
      if (!scheduledDate) {
        scheduledDate = new Date().toISOString();
      } else if (scheduledDate instanceof Date) {
        scheduledDate = scheduledDate.toISOString();
      }

      const payload = {
        job: this.selectedJob,
        scheduledDate: scheduledDate,
      };

      try {
        const response = await axios.post(`${this.baseUrl}/v1/execution`, payload);
        console.log('Job executed successfully:', response.data);
        this.toast.success('Job scheduled successfully');
        this.selectedJob = null;
      } catch (error) {
        console.error('Error executing job:', error);
        this.toast.error('Failed to execute job. Please try again.');
      }
    },
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
  justify-content: space-between; /* Position one button on the left and one on the right */
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
