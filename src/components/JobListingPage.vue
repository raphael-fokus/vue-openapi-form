<template>
    <div>
      <h1>Job Listing & Scheduling</h1>
      <job-list @schedule-job="scheduleJob" />
      <scheduling-area v-if="selectedJob" :selected-job="selectedJob" @cancel-schedule="cancelSchedule" @execute-job="executeJob" />
      <worker-list v-if="selectedJob" :selected-job="selectedJob" @assign-worker="assignWorker" />
  
      <button @click="goToExecutionList" class="button is-primary mt-20">Go to Execution List</button>
    </div>
  </template>
  
  <script>
  import JobList from './JobList.vue';
  import WorkerList from './WorkerList.vue';
  import SchedulingArea from './SchedulingArea.vue';
  import { useRouter } from 'vue-router';
  
  export default {
    components: {
      JobList,
      WorkerList,
      SchedulingArea
    },
    data() {
      return {
        selectedJob: null
      };
    },
    setup() {
      const router = useRouter();
  
      const goToExecutionList = () => {
        router.push({ name: 'ExecutionList' });
      };
  
      return {
        goToExecutionList
      };
    },
    methods: {
      scheduleJob(job) {
        this.selectedJob = job;
      },
      cancelSchedule() {
        this.selectedJob = null;
      },
      assignWorker({ worker, refSettingId }) {
        const unassignedTask = this.selectedJob.tasks.find(t => !t.worker.workerId && t.worker.workerType === worker.workerType);
        if (unassignedTask) {
          unassignedTask.worker.workerId = worker.workerId;
          unassignedTask.worker.workerName = worker.workerName;
          unassignedTask.worker.refSettingId = refSettingId;
        }
      },
      executeJob(scheduleData) {
        // Logic for executing job
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add custom styling here */
  </style>
  