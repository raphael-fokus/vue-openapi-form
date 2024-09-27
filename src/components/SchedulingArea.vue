<template>
  <div v-if="selectedJob" class="scheduling-container">
    <h2>Scheduling Job</h2>

    <!-- Job Details Section -->
    <div class="scheduling-details">
      <p><strong>Job:</strong> {{ selectedJob.jobName }} <i>({{ selectedJob.jobId }})</i></p>
      <p><strong>Assigned Workers:</strong></p>

      <!-- Task list with drop areas and worker dropdown -->
      <div class="task-list">
        <div v-for="(task, index) in selectedJob.tasks" :key="index" class="task-entry">
          <strong>{{ task.worker?.workerType || 'Unassigned' }}/{{ task.action }}:</strong>
          <div class="task-content">
            <!-- Draggable drop zone for workers -->
            <Draggable :list="[task.worker ? task.worker : {}]" :options="{ group: 'workers', put: true, pull: false }"
              class="task-drop-area" @change="onWorkerDrop($event, task)" item-key="workerId">
              <template #item="{ element }">
                <span v-if="element && element.workerName">{{ element.workerName }}</span>
                <span v-else>?</span>
              </template>
            </Draggable>

            <!-- Dropdown icon for selecting available workers -->
            <div class="worker-dropdown-container">
              <button class="dropdown-button" @click="toggleDropdown(index)">
                <i class="fa fa-caret-down"></i>
              </button>

              <!-- Worker selection dropdown -->
              <div v-if="dropdownVisible[index]" class="worker-dropdown">
                <ul>
                  <li v-for="worker in filterWorkersByTaskType(task.worker.workerType)" :key="worker.workerId" @click="selectWorkerForTask(worker, task)">
                    {{ worker.workerName }} ({{ worker.workerType }})
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Date Picker for Scheduling -->
      <div class="datetime-picker-container">
        <input type="datetime-local" v-model="scheduledDate" :min="currentDateTime" class="input is-primary" />
      </div>

      <!-- Scheduling Actions -->
      <div class="scheduling-actions">
        <button @click="cancelSchedule" class="button is-danger">Cancel Schedule</button>
        <button @click="executeJob" class="button is-primary ml-10">Schedule/Execute Job</button>
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';

export default {
  components: {
    Draggable
  },
  props: {
    selectedJob: {
      type: Object,
      required: true
    },
    availableWorkers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      scheduledDate: '',
      dropdownVisible: {} // Track which dropdowns are visible
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
      const offset = 2 * 60; // GMT+2 offset
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
    filterWorkersByTaskType(workerType) {
      return this.availableWorkers.filter(worker => worker.workerType === workerType && worker.workerType !== 'MANAGER');
    },
    toggleDropdown(index) {
      this.dropdownVisible[index] = !this.dropdownVisible[index];
    },
    selectWorkerForTask(worker, task) {
      task.worker = { ...worker };
      this.dropdownVisible = {}; // Close all dropdowns after selecting a worker
      this.selectedJob.tasks = [...this.selectedJob.tasks];
    },
    onWorkerDrop(event, task) {
      const droppedElement = event.added?.element;
      if (droppedElement) {
        task.worker = {
          workerId: droppedElement.workerId,
          workerName: droppedElement.workerName,
          workerType: droppedElement.workerType,
          refSettingId: droppedElement.refSettingId || ''
        };
        this.selectedJob.tasks = [...this.selectedJob.tasks];
      } else {
        console.log('No worker dropped');
      }
    }
  },
  mounted() {
    this.scheduledDate = this.getLocalTimeInGMT2().toISOString().slice(0, 16);
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

.task-list {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center align tasks */
  width: 100%;
}

.input.is-primary {
  margin: 10px 0;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 60%; /* Set the same width as task-drop-area for better alignment */
}

.datetime-picker-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.scheduling-actions {
  display: flex;
  justify-content: center; /* Center the actions */
  margin-top: 20px;
}

.task-entry {
  width: 60%; /* Set a consistent width */
  margin-bottom: 20px;
}

.task-content {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ensure proper spacing between dropzone and dropdown */
}

.task-drop-area {
  background-color: #e3e3e3;
  border: 2px dashed #ccc;
  padding: 15px;
  border-radius: 5px;
  width: 100%;
}

.worker-dropdown-container {
  position: relative;
  margin-left: 10px;
}

.dropdown-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.worker-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;
  width: 200px;
}

.worker-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.worker-dropdown li {
  padding: 10px;
  cursor: pointer;
}

.worker-dropdown li:hover {
  background-color: #eee;
}
</style>
