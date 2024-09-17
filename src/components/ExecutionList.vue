<template>
  <div class="executions-container">
    <h2>Executions</h2>
    <div v-if="executions.length">
      <div v-for="exe in executions" :key="exe.executionId" class="listEntry">
        <div class="execution-details">
          <p><strong>{{ formatScheduledDate(exe.date) }}</strong> - JobID/ExeID: {{ exe.job.jobName }} ({{ exe.job.jobId }} / {{ exe.executionId }})</p>
          <p><strong>State:</strong> {{ exe.state }} - <strong>Current Task:</strong> {{ exe.currentTaskNo }} / {{ exe.overallTasksSteps }}</p>
          
          <!-- Progress Bar for task execution -->
          <div class="progress-bar">
            <div class="progress" :style="{ width: getProgressPercentage(exe.currentTaskNo, exe.overallTasksSteps) }"></div>
          </div>

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
import Swal from 'sweetalert2';
import { useToast } from 'vue-toastification';  // Import useToast
import axios from 'axios';

export default {
  data() {
    return {
      executions: [],
      baseUrl: import.meta.env.VITE_BASE_URL
    };
  },
  setup() {
    const toast = useToast();  // Initialize toast

    return {
      toast  // Make toast available in the methods
    };
  },
  mounted() {
    this.fetchExecutions();
  },
  methods: {
    fetchExecutions() {
      axios.get(`${this.baseUrl}/v1/execution`)
        .then(response => {
          this.executions = response.data;
        })
        .catch(error => {
          console.error("Error fetching executions:", error);
        });
    },
    removeExecution(executionId) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this execution?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`${this.baseUrl}/v1/execution/${executionId}`)
            .then(() => {
              this.executions = this.executions.filter(exe => exe.executionId !== executionId);
              this.toast.success('Execution removed successfully');  // Success toast
            })
            .catch(error => {
              console.error("Error removing execution:", error);
              this.toast.error('Error removing execution');  // Error toast
            });
          Swal.fire('Removed!', 'The execution has been removed.', 'success');
        }
      });
    },
    isLastTask(task, tasks) {
      return tasks.indexOf(task) === tasks.length - 1;
    },
    getLocalTimeInGMT2() {
      const currentDate = new Date();
      const offset = 2 * 60;
      const localTime = new Date(currentDate.getTime() + offset * 60 * 1000);
      return localTime;
    },
    formatScheduledDate(scheduledDate) {
      const localTime = this.getLocalTimeInGMT2();
      return localTime.toISOString().slice(0, 16);
    },
    getProgressPercentage(currentTaskNo, overallTasksSteps) {
      const percentage = (currentTaskNo / overallTasksSteps) * 100;
      return `${percentage}%`;
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

.progress-bar {
  background-color: #ddd;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  width: 100%;
  margin-top: 5px;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.5s;
}
</style>
