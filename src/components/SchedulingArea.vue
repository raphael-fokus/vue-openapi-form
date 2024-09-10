<template>
  <div v-if="selectedJob">
    <h2>Scheduling Job</h2>
    <div>
      <p>Job: {{ selectedJob.jobName }} <i>({{ selectedJob.jobId }})</i></p>
      <p>Assigned Workers: 
        <span v-for="task in selectedJob.tasks" :key="task.worker.workerId">
          {{ task.worker.workerType }} - {{ task.worker.workerName || 'Unassigned' }}
        </span>
      </p>
      <input type="datetime-local" v-model="scheduledDate" :min="currentDateTime" />
      <button @click="cancelSchedule" class="button is-danger">Cancel Schedule</button>
      <button @click="executeJob" class="button is-primary ml-10">Schedule/Execute Job</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedJob: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      scheduledDate: this.getLocalTimeInGMT2().toISOString().slice(0, 16),
    };
  },
  computed: {
    currentDateTime() {
      return this.getLocalTimeInGMT2().toISOString().slice(0, 16);  
    }
  },
  methods: {
    getLocalTimeInGMT2() {
      const currentDate = new Date();
      const offset = 2 * 60;
      const localTime = new Date(currentDate.getTime() + offset * 60 * 1000);
      return localTime;
    },
    cancelSchedule() {
      this.$emit('cancel-schedule');
    },
    executeJob() {
      const formattedScheduledDate = this.formatScheduledDate(this.scheduledDate);
      
      const scheduleData = {
        job: this.selectedJob,
        scheduledDate: formattedScheduledDate
      };
      this.$emit('execute-job', scheduleData);
    },
    formatScheduledDate(scheduledDate) {
      if (!scheduledDate.includes(':00')) {
        scheduledDate += ':00';
      }
      if (!scheduledDate.includes('Z')) {
        scheduledDate += 'Z';  
      }
      return scheduledDate;
    }
  }
};
</script>

<style scoped>

</style>
