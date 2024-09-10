<template>
  <div class="executions-container">
    <h2>Executions</h2>
    <div v-if="executions.length">
      <div v-for="exe in executions" :key="exe.executionId" class="listEntry">
        <div class="execution-details">
          <p><strong>{{ new Date(exe.date).toISOString() }}</strong> - JobID/ExeID: {{ exe.job.jobName }} ({{ exe.job.jobId }} / {{ exe.executionId }})</p>
          <p><strong>State:</strong> {{ exe.state }} - <strong>Current Task:</strong> {{ exe.currentTaskNo }} / {{ exe.overallTasksSteps }}</p>
          <p><strong>Workers:</strong> 
            <span v-for="task in exe.job.tasks" :key="task.worker.workerId">
              {{ task.worker.workerType }} - {{ task.worker.workerName }}
              <span v-if="!isLastTask(task, exe.job.tasks)">, </span>
            </span>
          </p>
        </div>
        <div class="execution-actions">
          <button @click="removeExecution(exe.executionId)" class="button is-danger ml-10">Cancel/Remove</button>
        </div>
      </div>
    </div>
    <div v-else class="no-executions">
      No executions available.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      executions: [],
      baseUrl: import.meta.env.VITE_BASE_URL
    };
  },
  mounted() {
    this.fetchExecutions();
  },
  methods: {
    fetchExecutions() {
      this.$axios.get(`${this.baseUrl}/v1/execution`)
        .then(response => {
          this.executions = response.data;
        })
        .catch(error => {
          console.error("Error fetching executions:", error);
        });
      },
      removeExecution(executionId) {
        if (!confirm('Are you sure you want to remove this execution?')) return;

        axios.delete(`${this.baseUrl}/v1/execution/${executionId}`)
          .then(() => {
            this.executions = this.executions.filter(exe => exe.executionId !== executionId);
            alert('Execution removed successfully');
          })
          .catch(error => {
            console.error("Error removing execution:", error);
          });
      },
      isLastTask(task, tasks) {
        return tasks.indexOf(task) === tasks.length - 1;
      }
    }
};
</script>

<style scoped>
.executions-container {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.listEntry {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.execution-details {
  max-width: 80%;
}

.execution-actions {
  display: flex;
  justify-content: flex-end;
}

.no-executions {
  text-align: center;
  color: #666;
}
</style>

