<template>
  <div class="executions-container">
    <h2>Executions</h2>
    <div v-if="executions.length">
      <div v-for="exe in executions" :key="exe.executionId" class="listEntry">
        <div class="execution-details">
          <p>
            <strong>{{ formatScheduledDate(exe.scheduledDate) }}</strong> - JobID/ExeID:
            {{ exe.job.jobName }} ({{ exe.job.jobId }} / {{ exe.executionId }})
          </p>
          <p>
            <strong>State:</strong> {{ exe.state }} - <strong>Current Task:</strong> {{ exe.currentTaskNo
            }} <strong>
            Overall Progress:</strong> {{ exe.overallCurrentTaskNo }} / {{ exe.overallTasksSteps }}
          </p>

          <!-- Progress Bar for overall task execution -->
          <div class="progress-bar">
            <div class="progress"
              :style="{ width: getOverallProgressPercentage(exe.overallCurrentTaskNo, exe.overallTasksSteps) }"></div>
          </div>

          <p>
            <strong>Workers: </strong>
            <span v-for="(task, index) in exe.job.tasks" :key="task.worker.workerId">
              {{ task.worker.workerType }} - {{ task.worker.workerName }}
              <span v-if="index !== exe.job.tasks.length - 1">, </span>
            </span>
          </p>
        </div>
        <div class="execution-actions">
          <button @click="removeExecution(exe.executionId)"
            :class="['button', 'ml-10', removeConfirmations[exe.executionId] ? 'is-warning' : 'is-danger']">
            Cancel/Remove<span v-if="removeConfirmations[exe.executionId]">?</span>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-executions">
      No executions available.
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const toast = useToast();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const executions = computed(() => store.getters.executions);

    const removeConfirmations = ref({});

    const formatScheduledDate = (scheduledDate) => {
      if (!scheduledDate) return 'No Date Provided';
      const date = new Date(scheduledDate);
      return date.toLocaleString(); // Adjust format as needed
    };

    const getOverallProgressPercentage = (overallCurrentTaskNo, overallTasksSteps) => {
      const percentage = (overallCurrentTaskNo / overallTasksSteps) * 100;
      return `${percentage}%`;
    };

    const removeExecution = (executionId) => {
      if (!removeConfirmations.value[executionId]) {
        // First click: set confirmation to true
        removeConfirmations.value[executionId] = true;

        // Optionally, reset confirmation after a timeout
        setTimeout(() => {
          removeConfirmations.value[executionId] = false;
        }, 5000); // Reset after 5 seconds
      } else {
        // Second click: proceed to remove execution
        axios
          .delete(`${baseUrl}/v1/execution/${executionId}`)
          .then(() => {
            store.commit('REMOVE_EXECUTION', executionId);
            toast.success('Execution removed successfully');
            // Remove the confirmation state
            delete removeConfirmations.value[executionId];
          })
          .catch((error) => {
            console.error('Error removing execution:', error);
            toast.error('Error removing execution');
          });
      }
    };

    return {
      executions,
      formatScheduledDate,
      getOverallProgressPercentage,
      removeExecution,
      removeConfirmations,
    };
  },
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
  align-items: center;
  /* Vertically center items */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.execution-details {
  flex: 1;
}

.execution-actions {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.button {
  padding: 10px 20px;
  font-size: 14px;
}

.ml-10 {
  margin-left: 10px;
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
  max-width: 85%;
  width: 100%;
  margin-top: 5px;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.5s;
}

.is-warning {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  50% {
    transform: translateX(4px);
  }

  75% {
    transform: translateX(-4px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
