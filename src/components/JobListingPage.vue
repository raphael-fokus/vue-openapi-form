<template>
  <div class="job-listing-container">
    <h1>Jobs & Scheduling</h1>
    <job-list @schedule-job="scheduleJob" />

    <!-- Scheduling Area with WorkerList embedded within it -->
    <scheduling-area v-if="selectedJob" :selected-job="selectedJob" @cancel-schedule="cancelSchedule"
      @execute-job="executeJob" />

    <!-- Button with an icon pointing to Execution List -->
    <button @click="goToExecutionList" class="icon-button">
      <i class="fa fa-arrow-right"></i>
      <span class="tooltip">Current/Past Executions</span>
    </button>
  </div>
</template>

<script>
import JobList from './JobList.vue';
import SchedulingArea from './SchedulingArea.vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';  // Import useToast
import axios from 'axios';

export default {
  components: {
    JobList,
    SchedulingArea
  },
  data() {
    return {
      selectedJob: null,
      baseUrl: import.meta.env.VITE_BASE_URL
    };
  },
  setup() {
    const router = useRouter();
    const toast = useToast();  // Initialize toast

    const goToExecutionList = () => {
      router.push({ name: 'ExecutionList' });
    };

    return {
      goToExecutionList,
      toast  // Make toast available in the template and methods
    };
  },
  methods: {
    scheduleJob(job) {
      this.selectedJob = job;
    },
    cancelSchedule() {
      this.selectedJob = null;
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
        scheduledDate: scheduledDate
      };

      try {
        const response = await axios.post(`${this.baseUrl}/v1/execution`, payload);
        console.log('Job executed successfully:', response.data);

        this.toast.success('Job scheduled successfully');  // Success toast

        this.selectedJob = null;
      } catch (error) {
        console.error('Error executing job:', error);

        this.toast.error('Failed to execute job. Please try again.');  // Error toast
      }
    }
  }
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

.icon-button {
  position: relative;
  background-color: #176bb5;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 50%;
  cursor: pointer;
  margin-left: auto;
  margin-right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.tooltip {
  position: absolute;
  top: -30px;
  right: 50px;
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
