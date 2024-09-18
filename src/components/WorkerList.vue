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

    <!-- Draggable List of Connected Workers -->
    <h4>Connected Workers</h4>
    <draggable v-if="connectedWorkers.length" :list="connectedWorkers"
      :options="{ group: { name: 'workers', pull: 'clone', put: false }, sort: false }" item-key="workerId"
      class="draggable-worker-list">
      <template #item="{ element }">
        <div class="listEntry connected">
          <div class="worker-details">
            <p>
              <strong>{{ element.workerType }}:</strong> {{ element.workerName }}
              <i>({{ element.workerId }} ✔️)</i>
            </p>
            <div class="worker-action-container">
              <input type="text" v-model="refSetting[element.workerId]" placeholder="refSettingId"
                class="input is-primary ref-setting-input" />
              <button @click="assignWorker(element)" class="button is-primary">Assign</button>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <h4>Registered Workers</h4>
    <!-- List of Registered (Unconnected) Workers -->
    <div v-if="unconnectedWorkers.length">
      <div v-for="worker in unconnectedWorkers" :key="worker.workerId" class="listEntry not-connected">
        <div class="worker-details">
          <p>
            <strong>{{ worker.workerType }}:</strong> {{ worker.workerName }}
            <i>({{ worker.workerId }} ⚠️)</i>
          </p>
        </div>
        <div class="worker-actions">
          <button @click="connectWorker(worker)" class="button is-primary">Connect</button>
          <button @click="removeWorker(worker.workerId)" class="button is-danger ml-10">Remove</button>
        </div>
      </div>
    </div>

    <div v-else class="no-workers">
      No workers available.
    </div>

    <!-- Worker Registration Form -->
    <div class="worker-registration">
      <h3>Registration of Workers</h3>
      <div class="form-field">
        <label for="workerType"><strong>Worker Type:</strong></label>
        <!-- Dropdown for worker types -->
        <select id="workerType" v-model="newWorker.workerType" class="input is-primary">
          <option value="" disabled>Select Worker Type</option>
          <option value="PLAYER">PLAYER</option>
          <option value="MEASURING">MEASURING</option>
          <option value="ANALYST">ADMIN</option>
          <option value="OPERATOR">USER</option>
          <option value="OPERATOR">NETWORK</option>
          <option value="OPERATOR">SOURCE</option>
          <option value="OPERATOR">MANAGER</option>
        </select>
      </div>
      <div class="form-field">
        <label for="workerName"><strong>Worker Name:</strong></label>
        <input id="workerName" v-model="newWorker.workerName" placeholder="Worker Name" class="input is-primary" />
      </div>
      <div class="form-field">
        <label for="workerId"><strong>Worker ID:</strong></label>
        <input id="workerId" v-model="newWorker.workerId" placeholder="Worker ID" class="input is-primary" readonly />
      </div>
      <div class="registration-actions">
        <button @click="registerWorker" class="button is-primary">{{ registerButtonText }}</button>
      </div>
      <p class="state-message"><strong>State:</strong> {{ stateMessage }}</p>
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
    connectedWorkers() {
      return this.workers.filter((worker) => worker.connected);
    },
    unconnectedWorkers() {
      return this.workers.filter((worker) => !worker.connected);
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
    registerWorker() {
      if (!this.newWorker.workerType || !this.newWorker.workerName) {
        this.stateMessage = 'Please fill in both worker type and name.';
        return;
      }
      axios
        .post(`${this.baseUrl}/v1/registration`, this.newWorker)
        .then((response) => {
          const worker = response.data;
          const existingWorker = this.workers.find((w) => w.workerId === worker.workerId);
          if (!existingWorker) {
            this.workers.push({
              workerId: worker.workerId,
              workerType: worker.workerType,
              workerName: worker.workerName,
              connected: false, // Initially not connected
            });
            this.stateMessage = 'Worker registered successfully!';
          }
          // Generate a new UUID for the next worker registration
          this.newWorker.workerId = uuidv4();
        })
        .catch((error) => {
          this.toast.error('Error registering worker:', error);
          this.stateMessage = 'Failed to register worker.';
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
    assignWorker(worker) {
      this.$emit('assign-worker', { worker });
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

.registration-actions {
  margin-top: 10px;
}

.worker-details {
  flex: 1;
  font-size: 16px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.worker-details strong {
  font-size: 16px;
}

.worker-action-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ref-setting-input {
  width: 150px;
}

.button.is-primary {
  color: white;
  border: none;
}

.button.is-danger {
  color: white;
  border: none;
}

.worker-registration {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}

.input.is-primary {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  width: 100%;
}

.state-message {
  font-size: 16px;
  margin-top: 10px;
  color: #333;
}
</style>
