<template>
    <div>
      <h2>Executions</h2>
      <div v-if="executions.length">
        <div v-for="exe in executions" :key="exe.executionId" class="listEntry">
          {{ new Date(exe.date).toISOString() }} - 
          JobID/ExeID: {{ exe.job.jobName }} ({{ exe.job.jobId }} / {{ exe.executionId }}) 
          <br>
          <strong>State:</strong> {{ exe.state }} - 
          <strong>Current Task:</strong> {{ exe.currentTaskNo }} / {{ exe.overallTasksSteps }}
          <br>
          <strong>Workers:</strong> 
          <span v-for="task in exe.job.tasks" :key="task.worker.workerId">
            {{ task.worker.workerType }} - {{ task.worker.workerName }}
          </span>
          <button @click="removeExecution(exe.executionId)" class="button is-danger ml-10">Cancel/Remove</button>
        </div>
      </div>
      <div v-else>
        No executions available.
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        executions: []
      };
    },
    mounted() {
      this.fetchExecutions();
    },
    methods: {
      fetchExecutions() {
        this.$axios.get("http://localhost:3003/v1/execution")
          .then(response => {
            this.executions = response.data;
          })
          .catch(error => {
            console.error("Error fetching executions:", error);
          });
      },
      removeExecution(executionId) {
        if (!confirm('Are you sure you want to remove this execution?')) return;
        
        axios.delete(`/v1/execution/${executionId}`)
          .then(() => {
            this.executions = this.executions.filter(exe => exe.executionId !== executionId);
            alert('Execution removed successfully');
          })
          .catch(error => {
            console.error("Error removing execution:", error);
          });
      }
    }
  };
  </script>
  
  <style scoped>
 
  </style>
  