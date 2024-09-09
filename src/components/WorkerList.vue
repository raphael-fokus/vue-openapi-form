<template>
    <div>
      <h2>Available Workers</h2>
      <div v-if="workers.length">
        <div v-for="worker in workers" :key="worker.workerId" class="listEntry">
          {{ worker.workerType }}: {{ worker.workerName }} 
          <i>({{ worker.workerId }} {{ worker.connected ? '✔️' : '⚠️' }})</i>
          <input type="text" v-model="refSetting[worker.workerId]" placeholder="refSettingId" />
          <button @click="assignWorker(worker)" class="button is-primary">Assign</button>
        </div>
      </div>
      <div v-else>
        No workers available.
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      selectedJob: {
        type: Object,
        required: false // Only show when a job is selected
      }
    },
    data() {
      return {
        workers: [],
        refSetting: {} // To store reference settings for workers
      };
    },
    mounted() {
      this.fetchWorkers();
    },
    methods: {
      fetchWorkers() {
        this.$axios.get("http://localhost:3003/v1/workers")
          .then(response => {
            this.workers = response.data;
          })
          .catch(error => {
            console.error("Error fetching workers:", error);
          });
      },
      assignWorker(worker) {
        if (!this.selectedJob) {
          alert('Please select a job first');
          return;
        }
  
        const refSettingId = this.refSetting[worker.workerId] || "";
        this.$emit('assign-worker', { worker, refSettingId });
      }
    }
  };
  </script>
  
  <style scoped>

  </style>
  