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
        scheduledDate: new Date().toISOString().slice(0, 16)
      };
    },
    computed: {
      currentDateTime() {
        return new Date().toISOString().slice(0, 16);
      }
    },
    methods: {
      cancelSchedule() {
        this.$emit('cancel-schedule');
      },
      executeJob() {
        const scheduleData = {
          job: this.selectedJob,
          scheduledDate: this.scheduledDate || new Date().toISOString()
        };
        this.$emit('execute-job', scheduleData);
      }
    }
  };
  </script>
  
  <style scoped>

  </style>
  