<template>
  <div class="workers-container">
    <h2>Available Workers</h2>

    <!-- Worker Registration Form -->
    <div class="worker-registration">
      <h3>Register a Worker</h3>
      <div class="form-field">
        <label for="workerType"><strong>Worker Type:</strong></label>
        <input id="workerType" v-model="workerType" placeholder="PLAYER, MEASURING, etc." class="input is-primary" />
      </div>
      <div class="form-field">
        <label for="workerName"><strong>Worker Name:</strong></label>
        <input id="workerName" v-model="workerName" placeholder="Worker Name" class="input is-primary" />
      </div>
      <div class="form-field">
        <label for="workerId"><strong>Worker ID:</strong></label>
        <input id="workerId" v-model="workerId" placeholder="Worker ID" class="input is-primary" />
      </div>
      <div class="registration-actions">
        <button @click="registerWorker" class="button is-primary">{{ registerButtonText }}</button>
        <button @click="connectWorker" class="button is-primary ml-10">{{ connectButtonText }}</button>
      </div>
      <p class="state-message"><strong>State:</strong> {{ stateMessage }}</p>
    </div>

    <!-- Legend for worker status -->
    <div class="worker-legend">
      <p><strong>Legend:</strong> Registered <span class="icon-warning">⚠️</span>, Registered and Connected <span class="icon-connected">✔️</span></p>
    </div>

    <!-- List of Workers -->
    <div v-if="workers.length">
      <div v-for="worker in workers" :key="worker.workerId" class="listEntry">
        <div class="worker-details">
          <p>
            <strong>{{ worker.workerType }}:</strong> {{ worker.workerName }} 
            <i>({{ worker.workerId }} {{ worker.connected ? '✔️' : '⚠️' }})</i>
          </p>
          <input 
            type="text" 
            v-model="refSetting[worker.workerId]" 
            placeholder="refSettingId" 
            class="input is-primary" 
          />
        </div>
        <div class="worker-actions">
          <button @click="assignWorker(worker)" class="button is-primary">Assign</button>
          <button @click="removeWorker(worker.workerId)" class="button is-danger ml-10">Remove</button>
        </div>
      </div>
    </div>
    <div v-else class="no-workers">
      No workers available.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workers: [],
      refSetting: {},
      workerId: localStorage.getItem("workerId") || "",
      workerType: "",
      workerName: "",
      registerButtonText: "Register",
      connectButtonText: "Connect",
      stateMessage: "Not registered",
      baseUrl: import.meta.env.VITE_BASE_URL
    };
  },
  mounted() {
    this.checkWorkerRegistration();
    this.fetchWorkers();
  },
  methods: {
    fetchWorkers() {
      this.$axios.get(`${this.baseUrl}/v1/registration`)
        .then(response => {
          this.workers = response.data;
        })
        .catch(error => {
          console.error("Error fetching workers:", error);
        });
    },

    checkWorkerRegistration() {
      const workerId = localStorage.getItem("workerId");
      if (workerId) {
        this.workerId = workerId;
        this.getWorkerInfo(workerId);
      }
    },

    registerWorker() {
      if (this.registerButtonText === "Unregister") {
        this.unregisterWorker();
        return;
      }

      if (!this.workerType || !this.workerName) {
        this.stateMessage = "Please fill in both worker type and name.";
        return;
      }

      this.$axios.post(`${this.baseUrl}/v1/registration`, {
        workerId: this.workerId,
        workerType: this.workerType,
        workerName: this.workerName,
      })
        .then(response => {
          const worker = response.data;
          this.workerId = worker.workerId;
          localStorage.setItem("workerId", worker.workerId);
          this.registerButtonText = "Unregister";
          this.stateMessage = "Registered successfully!";
        })
        .catch(error => {
          console.error("Error registering worker:", error);
          this.stateMessage = "Failed to register worker.";
        });
    },

    unregisterWorker() {
      const workerId = this.workerId;
      this.$axios.delete(`${this.baseUrl}/v1/registration/${workerId}`)
        .then(() => {
          localStorage.removeItem("workerId");
          this.workerId = "";
          this.workerType = "";
          this.workerName = "";
          this.registerButtonText = "Register";
          this.stateMessage = "Unregistered successfully.";
        })
        .catch(error => {
          console.error("Error unregistering worker:", error);
          this.stateMessage = "Failed to unregister worker.";
        });
    },

    getWorkerInfo(workerId) {
      this.$axios.get(`${this.baseUrl}/v1/registration/${workerId}`)
        .then(response => {
          const worker = response.data;
          this.workerType = worker.workerType;
          this.workerName = worker.workerName;
          this.workerId = worker.workerId;
          this.registerButtonText = "Unregister";
          this.stateMessage = "Registered and connected.";
        })
        .catch(error => {
          console.error("Error fetching worker info:", error);
          this.stateMessage = "Failed to fetch worker info.";
        });
    },

    connectWorker() {
      if (!this.workerId) {
        this.stateMessage = "Please register a worker first.";
        return;
      }

      const socket = new WebSocket(`ws://${location.host}/v1/connection?workerId=${this.workerId}`);
      socket.onopen = () => {
        this.connectButtonText = "Disconnect";
        this.stateMessage = "Connected successfully.";
      };
      socket.onclose = () => {
        this.connectButtonText = "Connect";
        this.stateMessage = "Disconnected.";
      };
      socket.onerror = () => {
        this.stateMessage = "Connection error.";
      };
    },

    assignWorker(worker) {
      if (!this.selectedJob) {
        alert('Please select a job first');
        return;
      }

      const refSettingId = this.refSetting[worker.workerId] || "";
      this.$emit('assign-worker', { worker, refSettingId });
    },

    // Remove a worker from the list
    removeWorker(workerId) {
      if (confirm('Are you sure you want to remove this worker?')) {
        this.$axios.delete(`${this.baseUrl}/v1/registration/${workerId}`)
          .then(() => {
            this.workers = this.workers.filter(worker => worker.workerId !== workerId);
            alert('Worker removed successfully.');
          })
          .catch(error => {
            console.error("Error removing worker:", error);
            alert('Failed to remove worker.');
          });
      }
    }
  }
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

.worker-registration {
  margin-bottom: 20px;
}

.form-field {
  margin-bottom: 10px;
}

.input.is-primary {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.worker-legend {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.icon-warning {
  color: #f39c12; 
}

.icon-connected {
  color: #27ae60; 
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

.worker-details {
  max-width: 70%;
}

.worker-actions {
  display: flex;
  align-items: center;
}

.state-message {
  font-size: 14px;
  margin-top: 10px;
}
</style>
