<template>
  <div v-if="selectedJob" class="scheduling-container">
    <h2>Scheduling Job</h2>

    <!-- Job Details Section -->
    <div class="scheduling-details">
      <p><strong>Job:</strong> {{ selectedJob.jobName }} <i>({{ selectedJob.jobId }})</i></p>
      <p><strong>Assigned Workers:</strong></p>

      <!-- Task list with drop areas for workers -->
      <div
        v-for="(task, index) in selectedJob.tasks"
        :key="index"
        class="task-entry"
      >
        <strong>{{ task.worker.workerType }}/{{ task.action }}:</strong>
        <Draggable
          :list="[]"
          group="workers"
          class="task-drop-area"
          @change="onWorkerDrop($event, task)"
          item-key="workerId"
        >
          <template #item="{ element }">
            <div class="task-content">
              <span v-if="task.worker && task.worker.workerName">
                {{ task.worker.workerName }}
              </span>
              <span v-else>
                Drop worker here
              </span>
            </div>
          </template>
        </Draggable>
      </div>

      <!-- Date Picker for Scheduling -->
      <input
        type="datetime-local"
        v-model="scheduledDate"
        :min="currentDateTime"
        class="input is-primary"
      />

      <!-- Scheduling Actions -->
      <div class="scheduling-actions">
        <button @click="cancelSchedule" class="button is-danger">Cancel Schedule</button>
        <button @click="executeJob" class="button is-primary ml-10">Schedule/Execute Job</button>
      </div>
    </div>

    <!-- Worker List and Registration Form -->
    <WorkerList
      :selected-job="selectedJob"
      @assign-worker="handleWorkerAssignment"
    />
  </div>
</template>

<script>
import WorkerList from './WorkerList.vue';
import Draggable from 'vuedraggable';

export default {
  components: {
    WorkerList,
    Draggable
  },
  props: {
    selectedJob: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      scheduledDate: '',
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
    onWorkerDrop(event, task) {
      const droppedElement = event.added?.element;

      if (droppedElement) {
        // Replace the worker object to ensure Vue detects the change
        task.worker = {
          workerId: droppedElement.workerId,
          workerName: droppedElement.workerName,
          workerType: droppedElement.workerType,
          refSettingId: droppedElement.refSettingId || ""  // Keep other relevant worker data
        };

        // Force Vue to re-render by reassigning the tasks array
        this.selectedJob.tasks = [...this.selectedJob.tasks];
      }
    },

    handleWorkerAssignment({ worker, refSettingId }) {
      const unassignedTask = this.selectedJob.tasks.find(
        (task) => !task.worker.workerId && task.worker.workerType === worker.workerType
      );

      if (!unassignedTask) {
        alert(`No unassigned tasks for worker type ${worker.workerType}.`);
        return;
      }

      unassignedTask.worker = worker;

      // Trigger reactivity by replacing the task list with a new array
      this.selectedJob.tasks = [...this.selectedJob.tasks];
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

.input.is-primary {
  margin: 10px 0;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.scheduling-actions {
  margin-top: 20px;
}

.task-drop-area {
  background-color: #e3e3e3;
  border: 2px dashed #ccc;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}
</style>
