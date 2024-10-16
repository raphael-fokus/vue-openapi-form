<template>
    <div class="job-listing-container">
      <h1>Jobs & Scheduling</h1>
  
      <!-- Job List Component -->
      <JobList @schedule-job="scheduleJob" />
  
      <!-- Scheduling Area -->
      <SchedulingArea
        v-if="selectedJob"
        :selected-job="selectedJob"
        @cancel-schedule="cancelSchedule"
        @execute-job="executeJob"
      />
  
      <!-- Worker List Component -->
      <WorkerList />
  
      <!-- Icon Buttons für Worker Registration und Executions -->
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
  
      <!-- Worker Registration Component, conditionally sichtbar -->
      <WorkerRegistration
        v-if="isWorkerRegistrationVisible"
        @close="toggleWorkerRegistration"
        @worker-registered="refreshWorkers"
      />
    </div>
  </template>
  
  <script>
  import JobList from '@/components/JobList.vue';
  import SchedulingArea from '@/components/SchedulingArea.vue';
  import WorkerList from '@/components/WorkerList.vue';
  import WorkerRegistration from '@/components/WorkerRegistration.vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'Jobs',
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
  
      const selectedJob = ref(null);
      const isWorkerRegistrationVisible = ref(false);
  
      const goToExecutionList = () => {
        router.push({ name: 'ExecutionList' });
      };
  
      const toggleWorkerRegistration = () => {
        isWorkerRegistrationVisible.value = !isWorkerRegistrationVisible.value;
      };
  
      const scheduleJob = (job) => {
        job.tasks.forEach((task) => {
          if (!task.worker) {
            task.worker = null; // Zurücksetzen der Worker-Zuordnung für neue Planung
          }
        });
        selectedJob.value = job; // Direkte Zuweisung für Reaktivität
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
  
      const refreshWorkers = () => {
        store.dispatch('fetchWorkers');
      };
  
      return {
        selectedJob,
        isWorkerRegistrationVisible,
        goToExecutionList,
        toggleWorkerRegistration,
        scheduleJob,
        cancelSchedule,
        executeJob,
        refreshWorkers,
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
    justify-content: flex-end;
    gap: 10px;
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
  