<template>
  <div v-if="selectedJob" class="scheduling-container">
    <h2>Scheduling Job</h2>
    <div class="scheduling-details">
      <p><strong>Job:</strong> {{ selectedJob.jobName }} <i>({{ selectedJob.jobId }})</i></p>
      <p><strong>Assigned Workers:</strong></p>

      <!-- Task list with drop areas for workers -->
      <div v-for="(task, index) in selectedJob.tasks" :key="index" class="task-entry">
        <strong>{{ task.worker.workerType }}/{{ task.action }}:</strong>
        <draggable
          :list="[]"
          group="workers"
          class="task-drop-area"
          @change="onWorkerDrop(task)"
        >
          <template #item="{ element }">
            <div class="task-content">
              <span v-if="task.worker.workerName">
                {{ task.worker.workerName }}
              </span>
              <span v-else>
                Drop worker here
              </span>
            </div>
          </template>
        </draggable>
      </div>

      <input type="datetime-local" v-model="scheduledDate" :min="currentDateTime" class="input is-primary" />
      <div class="scheduling-actions">
        <button @click="cancelSchedule" class="button is-danger">Cancel Schedule</button>
        <button @click="executeJob" class="button is-primary ml-10">Schedule/Execute Job</button>
      </div>
    </div>

    <!-- Worker List Panel (draggable workers) -->
    <div class="draggable-worker-list">
      <h3>Available Workers</h3>
      <draggable
        :list="availableWorkers"
        group="{ name: 'workers', pull: 'clone', put: false }"
        class="worker-list"
        item-key="workerId"
      >
        <template #item="{ element }">
          <div class="worker-item">
            <p>{{ element.workerName }} ({{ element.workerType }})</p>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable
  },
  props: {
    selectedJob: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      scheduledDate: this.getLocalTimeInGMT2().toISOString().slice(0, 16),
      availableWorkers: [] // Holds the list of workers that are draggable
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
      const offset = 2 * 60; // Offset for GMT+2
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
    },
    onWorkerDrop(task) {
      return (event) => {
        const worker = event.item.__vue__.element;
        if (worker) {
          task.worker.workerId = worker.workerId;
          task.worker.workerName = worker.workerName;
          task.worker.workerType = worker.workerType;
        }
      };
    },
    loadAvailableWorkers() {
      this.$axios.get(`${this.baseUrl}/v1/registration`)
        .then(response => {
          this.availableWorkers = response.data.filter(worker => worker.connected);
        })
        .catch(error => {
          console.error("Error fetching workers:", error);
        });
    }
  },
  mounted() {
    this.loadAvailableWorkers();
  }
};
</script>

<style scoped>
.scheduling-container {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.scheduling-details {
  margin-bottom: 20px;
}

.task-entry {
  padding: 10px 0;
  margin-bottom: 10px;
}

.task-drop-area {
  border: 2px dashed #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f4f4f4;
}

.task-content {
  font-weight: bold;
}

.worker-list {
  margin-top: 20px;
}

.worker-item {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.input.is-primary {
  margin: 10px 0;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.scheduling-actions {
  margin-top: 20px;
}

.draggable-worker-list {
  margin-top: 20px;
}
</style>
