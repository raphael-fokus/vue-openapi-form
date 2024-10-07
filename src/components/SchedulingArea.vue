<template>
  <div v-if="selectedJob" class="scheduling-container">
    <h2>Scheduling Job</h2>

    <!-- Job Details Section -->
    <div class="scheduling-details">
      <p><strong>Job:</strong> {{ selectedJob.jobName }} <i>({{ selectedJob.jobId }})</i></p>
      <p><strong>Assigned Workers:</strong></p>

      <!-- Task list with drop areas and worker dropdown -->
      <div class="task-list">
        <div v-for="(task, taskIndex) in selectedJob.tasks" :key="taskIndex" class="task-entry">
          <strong>{{ getWorkerDisplay(task) }}/{{ task.action }}:</strong>
          <div class="task-content">
            <!-- Draggable drop zone for workers -->
            <Draggable :list="task.worker ? [task.worker] : []" :options="{ group: 'workers', put: true, pull: false }"
              class="task-drop-area" @change="onWorkerDrop($event, task)" item-key="workerId">
              <template #item="{ element }">
                <span v-if="element && element.workerName">{{ element.workerName }}</span>
                <span v-else>?</span>
              </template>
            </Draggable>

            <!-- Dropdown icon for selecting available workers -->
            <div class="worker-dropdown-container">
              <button class="dropdown-button" @click="toggleDropdown(taskIndex)">
                <i class="fa fa-caret-down"></i>
              </button>

              <!-- Worker selection dropdown with search, sort, and filter -->
              <div v-if="dropdownVisible[taskIndex]" class="worker-dropdown">
                <input v-model="searchQuery" type="text" placeholder="Search workers..." class="worker-search-input" />
                <div class="worker-filters">
                  <label>Sort by:</label>
                  <select v-model="selectedSortOption" class="worker-sort-filter">
                    <option value="name">Name</option>
                    <option value="status">Connection Status</option>
                  </select>
                </div>
                <ul>
                  <li v-for="worker in filteredAndSortedWorkers(task.worker ? task.worker.workerType : task.workerType)"
                    :key="worker.workerId" @click="selectWorkerForTask(worker, task, taskIndex)">
                    {{ getDropdownWorkerDisplay(worker) }}
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
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    Draggable,
  },
  props: {
    selectedJob: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();

    const scheduledDate = ref('');
    const dropdownVisible = ref({});
    const searchQuery = ref('');
    const selectedSortOption = ref('name');

    const workers = computed(() => store.getters.workers);

    const currentDateTime = computed(() => {
      return getLocalTimeInCurrentTimezone().toISOString().slice(0, 16);
    });

    function getLocalTimeInCurrentTimezone() {
      const currentDate = new Date();
      const timezoneOffsetInMinutes = currentDate.getTimezoneOffset(); // Get the local timezone offset in minutes
      const adjustedDate = new Date(currentDate.getTime() - timezoneOffsetInMinutes * 60000); // Adjust the time
      return adjustedDate;
    }

    function cancelSchedule() {
      emit('cancel-schedule');
    }

    function executeJob() {
      const formattedScheduledDate = formatScheduledDate(scheduledDate.value);
      const scheduleData = {
        job: props.selectedJob,
        scheduledDate: formattedScheduledDate || null,
      };
      emit('execute-job', scheduleData);
    }

    function formatScheduledDate(scheduledDate) {
      const date = new Date(scheduledDate);
      return date.toISOString(); // Return the ISO format with the correct "date-time" format with "Z"
    }

    function filteredAndSortedWorkers(workerType) {
      if (!workerType) return [];

      let filteredWorkers = workers.value
        .filter(
          (worker) =>
            worker.workerType === workerType &&
            worker.workerType !== 'MANAGER' &&
            worker.workerType !== 'ADMIN'
        )
        .filter((worker) => {
          const matchesSearch =
            worker.workerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            worker.workerId.toLowerCase().includes(searchQuery.value.toLowerCase());
          return matchesSearch;
        });

      if (selectedSortOption.value === 'name') {
        filteredWorkers.sort((a, b) => a.workerName.localeCompare(b.workerName));
      } else if (selectedSortOption.value === 'status') {
        filteredWorkers.sort((a, b) => (a.connected === b.connected ? 0 : a.connected ? -1 : 1));
      }

      return filteredWorkers;
    }

    function toggleDropdown(taskIndex) {
      dropdownVisible.value[taskIndex] = !dropdownVisible.value[taskIndex];
    }

    function selectWorkerForTask(worker, task, taskIndex) {
      task.worker = worker; // Assign by reference
      dropdownVisible.value[taskIndex] = false;
      props.selectedJob.tasks = [...props.selectedJob.tasks];
    }

    function onWorkerDrop(event, task) {
      const droppedElement = event.added?.element;
      if (droppedElement) {
        task.worker = droppedElement; // Assign by reference
        props.selectedJob.tasks = [...props.selectedJob.tasks];
      } else {
        console.log('No worker dropped');
      }
    }

    function getWorkerDisplay(task) {
      const worker = task.worker;
      const workerType =
        worker && worker.workerType === 'MEASURING' && worker.workerInstance !== undefined
          ? `${worker.workerType}-${worker.workerInstance}`
          : worker
            ? worker.workerType
            : task.workerType || 'Unassigned';

      const statusIcon = worker && worker.workerName ? (worker.connected ? '✔️' : '⚠️') : '?';

      return `${workerType} (${statusIcon})`;
    }

    function getDropdownWorkerDisplay(worker) {
      const statusIcon = worker.connected ? '✔️' : '⚠️';
      return `${worker.workerName} (${statusIcon})`;
    }

    scheduledDate.value = getLocalTimeInCurrentTimezone().toISOString().slice(0, 16);

    return {
      scheduledDate,
      dropdownVisible,
      searchQuery,
      selectedSortOption,
      currentDateTime,
      getLocalTimeInCurrentTimezone,
      cancelSchedule,
      executeJob,
      formatScheduledDate,
      filteredAndSortedWorkers,
      toggleDropdown,
      selectWorkerForTask,
      onWorkerDrop,
      getWorkerDisplay,
      getDropdownWorkerDisplay,
    };
  },
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
  align-items: center;
  width: 100%;
}

.input.is-primary {
  margin: 10px 0;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 60%;
}

.datetime-picker-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.scheduling-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.task-entry {
  width: 60%;
  margin-bottom: 20px;
}

.task-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  width: 250px;
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

.worker-search-input {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}

.worker-filters {
  padding: 10px;
}

.worker-sort-filter {
  width: 100%;
  padding: 5px;
}
</style>
