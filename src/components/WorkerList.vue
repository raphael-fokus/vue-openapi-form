<template>
  <div class="workers-container">
    <h2>Workers</h2>

    <!-- Legend for worker status -->
    <div class="worker-legend">
      <p>
        <strong>Legend:</strong> Registered <span class="icon-warning">⚠️</span>, Registered and Connected
        <span class="icon-connected">✔️</span>
      </p>
    </div>

    <!-- Draggable List of Workers (connected and unconnected) excluding ADMIN workers -->
    <draggable v-if="sortedWorkers.length" :list="sortedWorkers"
      :options="{ group: { name: 'workers', pull: 'clone', put: false }, sort: false }" item-key="workerId"
      class="draggable-worker-list">
      <template #item="{ element }">
        <div class="listEntry" :class="{ connected: element.connected }">
          <div class="worker-details">
            <p>
              <strong>{{ element.workerType }}:</strong> {{ element.workerName }}
              <i>({{ element.workerId }})</i>
              <span v-if="element.connected" class="icon-connected">✔️</span>
              <span v-else class="icon-warning">⚠️</span>
            </p>
            <input type="text" v-model="refSetting[element.workerId]" placeholder="refSettingId"
              class="input is-primary ref-setting-input" />
          </div>
          <div class="worker-actions">
            <button v-if="!element.connected" @click="connectWorker(element)" class="button is-primary">Connect</button>
            <button @click="removeWorker(element.workerId)" class="button is-danger ml-10">Remove</button>
          </div>
        </div>
      </template>
    </draggable>

    <div v-else class="no-workers">
      No workers available.
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

export default {
  components: {
    draggable,
  },
  data() {
    return {
      workers: [], // List of all workers (connected and unconnected)
      refSetting: {},
      newWorker: {
        workerId: uuidv4(), // Automatically generate a UUID for the Worker ID
        workerType: '', // Worker type now selected from dropdown
        workerName: '',
      },
      registerButtonText: 'Register',
      stateMessage: 'Not registered',
      baseUrl: import.meta.env.VITE_BASE_URL,
    };
  },
  computed: {
    sortedWorkers() {
      // Filter out ADMIN workers and sort by connection status (connected first)
      return this.workers
        .filter((worker) => worker.workerType !== 'ADMIN')
        .sort((a, b) => (a.connected === b.connected ? 0 : a.connected ? -1 : 1));
    },
  },
  mounted() {
    this.fetchWorkers(); // Fetch all registered workers on mount
  },
  setup() {
    const toast = useToast(); // Use the toast function here
    return {
      toast,
    };
  },
  watch: {
    workers: {
      handler(newVal) {
        // Emit the list of workers whenever it's updated
        this.$emit('update-workers', newVal);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    fetchWorkers() {
      axios
        .get(`${this.baseUrl}/v1/registration`)
        .then((response) => {
          this.workers = response.data;
        })
        .catch((error) => {
          this.toast.error('Error fetching workers:', error);
        });
    },
    connectWorker(worker) {
      const socket = new WebSocket(
        `ws://${location.host.replace('3000', '3003')}/v1/connection?workerId=${worker.workerId}`
      );

      socket.onopen = () => {
        this.stateMessage = `Worker ${worker.workerName} connected successfully!`;
        this.toast.success(`Worker ${worker.workerName} connected successfully!`);

        const workerIndex = this.workers.findIndex((w) => w.workerId === worker.workerId);
        if (workerIndex !== -1) {
          this.workers[workerIndex].connected = true;
        }
      };

      socket.onclose = () => {
        this.stateMessage = `Worker ${worker.workerName} disconnected.`;
      };

      socket.onerror = () => {
        this.stateMessage = 'Connection error.';
        this.toast.error('Connection error.');
      };
    },
    removeWorker(workerId) {
      if (confirm('Are you sure you want to remove this worker?')) {
        axios
          .delete(`${this.baseUrl}/v1/registration/${workerId}`)
          .then(() => {
            this.workers = this.workers.filter((worker) => worker.workerId !== workerId);
            this.stateMessage = 'Worker removed successfully.';
            this.toast.success('Worker removed successfully.');
          })
          .catch((error) => {
            this.stateMessage = 'Failed to remove worker.';
            this.toast.error('Failed to remove worker.');
          });
      }
    },
  },
};
</script>

<style scoped>
.workers-container {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.worker-legend {
  margin-bottom: 20px;
  font-size: 16px;
  color: #666;
}

.listEntry {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.connected .worker-details strong {
  color: green;
}

.not-connected .worker-details strong {
  color: red;
}

.worker-details {
  flex: 1;
  font-size: 16px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.worker-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ref-setting-input {
  width: 270px;
}

.button.is-primary {
  color: white;
  border: none;
}

.button.is-danger {
  color: white;
  border: none;
}

.no-workers {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.icon-warning {
  color: #ff3860;
}

.icon-connected {
  color: #23d160;
}
</style>
