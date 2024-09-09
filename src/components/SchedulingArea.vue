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
      scheduledDate: new Date().toISOString().slice(0, 16)  // No seconds or timezone here, will fix later
    };
  },
  computed: {
    currentDateTime() {
      return new Date().toISOString().slice(0, 16);  // No seconds or timezone here, will fix later
    }
  },
  methods: {
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
      // Add ":00" for seconds and "Z" for UTC timezone
      if (!scheduledDate.includes(':00')) {
        scheduledDate += ':00';
      }
      if (!scheduledDate.includes('Z')) {
        scheduledDate += 'Z';  // Assumes UTC
      }
      return scheduledDate;
    }
  }
};
</script>

<style scoped>

</style>
