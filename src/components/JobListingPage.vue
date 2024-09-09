<template>
  <div>
    <h1>Job Listing & Scheduling</h1>
    <job-list @schedule-job="scheduleJob" />
    <scheduling-area
      v-if="selectedJob"
      :selected-job="selectedJob"
      @cancel-schedule="cancelSchedule"
      @execute-job="executeJob"
    />
    <worker-list
      v-if="selectedJob"
      :selected-job="selectedJob"
      @assign-worker="assignWorker"
    />

    <button @click="goToExecutionList" class="button is-primary mt-20">
      Go to Execution List
    </button>
  </div>
</template>

<script>
import JobList from './JobList.vue';
import WorkerList from './WorkerList.vue';
import SchedulingArea from './SchedulingArea.vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; 

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
      const unassignedTask = this.selectedJob.tasks.find(
        (t) => !t.worker.workerId && t.worker.workerType === worker.workerType
      );
      if (unassignedTask) {
        unassignedTask.worker.workerId = worker.workerId;
        unassignedTask.worker.workerName = worker.workerName;
        unassignedTask.worker.refSettingId = refSettingId;
      }
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
        
        const response = await axios.post('http://localhost:3003/v1/execution', payload);
        console.log('Job executed successfully:', response.data);
        alert('Job scheduled successfully');
        
        this.selectedJob = null;
      } catch (error) {
        console.error('Error executing job:', error);
        alert('Failed to execute job. Please try again.');
      }
    }
  }
};
</script>

<style scoped>

</style>
