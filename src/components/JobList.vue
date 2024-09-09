<template>
    <div>
      <h2>Job Listing</h2>
      <div v-if="jobs.length">
        <div v-for="job in jobs" :key="job.jobId" class="listEntry">
          {{ job.jobName }} 
          <i>({{ job.jobId }})</i>
          <span>Contents: {{ job.streams.length }}, Tasks: {{ job.tasks.length }}</span>
          <button @click="scheduleJob(job)" class="button is-primary">Schedule Job</button>
        </div>
      </div>
      <div v-else>
        No jobs available.
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        jobs: []
      };
    },
    mounted() {
      this.fetchJobs();
    },
    methods: {
      fetchJobs() {
        this.$axios.get("http://localhost:3003/v1/measurement")
          .then(response => {
            this.jobs = response.data;
          })
          .catch(error => {
            console.error("Error fetching jobs:", error);
          });
      },
      scheduleJob(job) {
        this.$emit('schedule-job', job); 
      }
    }
  };
  </script>
  
  <style scoped>
  .listEntry {
    background-color: #eeeeee;
    padding: 5px;
    margin: 2px;
  }
  </style>
  