<template>
  <div v-if="selectedJob" class="scheduling-container">
    <h2>Scheduling Job</h2>
    <div class="scheduling-details">
      <p><strong>Job:</strong> {{ selectedJob.jobName }} <i>({{ selectedJob.jobId }})</i></p>
      <p><strong>Assigned Workers:</strong> 
        <!-- Loop through the tasks to show worker type, action, and assigned worker or '?' -->
        <span v-for="(task, index) in selectedJob.tasks" :key="index">
          {{ task.worker.workerType }}/{{ task.action }}({{ task.worker.workerName || '?' }})
          <span v-if="!isLastTask(index, selectedJob.tasks)">, </span>
        </span>
      </p>
      <worker-list :selected-job="selectedJob" @assign-worker="handleWorkerAssignment" />
      <input type="datetime-local" v-model="scheduledDate" :min="currentDateTime" class="input is-primary" />
      <div class="scheduling-actions">
        <button @click="cancelSchedule" class="button is-danger">Cancel Schedule</button>
        <button @click="executeJob" class="button is-primary ml-10">Schedule/Execute Job</button>
      </div>
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
      scheduledDate: this.getLocalTimeInGMT2().toISOString().slice(0, 16),
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
      const offset = 2 * 60;
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
    isLastTask(index, tasks) {
      return index === tasks.length - 1;
    },
    handleWorkerAssignment({ worker, refSettingId }) {
      const unassignedTask = this.selectedJob.tasks.find(
        (task) => !task.worker.workerId && task.worker.workerType === worker.workerType
      );

      if (!unassignedTask) {
        alert(`No unassigned tasks for worker type ${worker.workerType}.`);
        return;
      }

      unassignedTask.worker.workerId = worker.workerId;
      unassignedTask.worker.workerName = worker.workerName;
      unassignedTask.worker.refSettingId = refSettingId || "";

      this.selectedJob.tasks = [...this.selectedJob.tasks];
    }
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
</style>
