<!-- Jobs.vue (Tab 2) -->
<template>
  <div class="job-listing-container">
    <h1>Jobs & Scheduling</h1>

    <!-- Job List Component -->
    <JobList @schedule-job="scheduleJob" />

    <!-- Scheduling Area -->
    <SchedulingArea v-if="selectedJob" :selected-job="selectedJob" @cancel-schedule="cancelSchedule"
      @execute-job="executeJob" />

    <!-- Icon Buttons for navigation -->
    <div class="icon-buttons">
      <!-- Left-aligned Navigation Buttons -->
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
      </div>

      <!-- Right-aligned Executions Button -->
      <button @click="goToExecutionsPage" class="icon-button">
        <i class="fa fa-play"></i>
        <span class="tooltip">Executions</span>
      </button>
    </div>
  </div>
</template>

<script>
import JobList from '@/components/JobList.vue';
import SchedulingArea from '@/components/SchedulingArea.vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Jobs',
  components: {
    JobList,
    SchedulingArea,
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const store = useStore();

    const selectedJob = ref(null);

    const goToHomePage = () => {
      router.push({ name: 'Home' });
    };

    const goToWorkersPage = () => {
      router.push({ name: 'Workers' });
    };

    const goToExecutionsPage = () => {
      router.push({ name: 'Executions' });
    };

    const scheduleJob = (job) => {
      job.tasks.forEach((task) => {
        if (!task.worker) {
          task.worker = null;
        }
      });
      selectedJob.value = job;
    };

    const cancelSchedule = () => {
      selectedJob.value = null;
    };

    const executeJob = async (scheduleData) => {
      let { scheduledDate } = scheduleData;
      try {
        await store.dispatch('executeJob', {
          job: selectedJob.value,
          scheduledDate: scheduledDate || new Date().toISOString(),
        });
        toast.success('Job scheduled successfully');
        selectedJob.value = null;
      } catch (error) {
        toast.error('Failed to execute job. Please try again.');
      }
    };

    return {
      selectedJob,
      goToHomePage,
      goToWorkersPage,
      goToExecutionsPage,
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
