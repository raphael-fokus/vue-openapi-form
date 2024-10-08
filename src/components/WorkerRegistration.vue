<template>
  <div class="worker-registration-container">
    <h3>Register New Worker</h3>
    <div class="form-field">
      <label for="workerType"><strong>Worker Type:</strong></label>
      <select id="workerType" v-model="newWorker.workerType" class="input is-primary">
        <option value="" disabled>Select Worker Type</option>
        <option value="PLAYER">PLAYER</option>
        <option value="MEASURING">MEASURING</option>
        <option value="USER">USER</option>
        <option value="NETWORK">NETWORK</option>
        <option value="SOURCE">SOURCE</option>
      </select>
    </div>
    <div class="form-field">
      <label for="workerName"><strong>Worker Name:</strong></label>
      <input id="workerName" v-model="newWorker.workerName" placeholder="Worker Name" class="input is-primary" />
    </div>
    <div class="registration-actions">
      <button @click="registerWorker" class="button is-primary">{{ registerButtonText }}</button>
    </div>
    <p class="state-message"><strong>State:</strong> {{ stateMessage }}</p>

    <!-- list of registered workers -->
    <div v-if="registeredWorkers.length > 0" class="registered-workers">
      <h3>Registered Workers</h3>
      <div v-for="(worker, index) in registeredWorkers" :key="worker.workerId" class="worker-item" :class="{'worker-item--alt': index % 2 !== 0}">
        <Worker :worker="worker" />
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Worker from './Worker.vue'; 

export default {
  components: {
    Worker,
  },
  data() {
    return {
      newWorker: {
        workerType: '',
        workerName: '',
      },
      registeredWorkers: [], 
      registerButtonText: 'Register',
      stateMessage: 'Not registered',
      baseUrl: import.meta.env.VITE_BASE_URL,
    };
  },
  methods: {
    registerWorker() {
      if (!this.newWorker.workerType || !this.newWorker.workerName) {
        this.stateMessage = 'Please fill in both worker type and name.';
        return;
      }

      // new workerId for each registration
      const workerToRegister = {
        ...this.newWorker,
        workerId: uuidv4(),
      };

      axios
        .post(`${this.baseUrl}/v1/registration`, workerToRegister)
        .then((response) => {
          const workerData = response.data;
          this.stateMessage = `Worker "${workerData.workerName}" registered successfully!`;
          this.registeredWorkers.push(workerData);
          // Reset the form
          this.newWorker = {
            workerType: '',
            workerName: '',
          };
        })
        .catch((error) => {
          this.stateMessage = 'Failed to register worker.';
          console.error('Error registering worker:', error);
        });
    },
  },
};
</script>

<style scoped>
.worker-registration-container {
  padding: 20px;
  background-color: #e5e3e3; 
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.form-field {
  margin-bottom: 10px;
}

.input.is-primary {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  width: 100%;
}

.registration-actions {
  margin-top: 10px;
}

.state-message {
  margin-top: 10px;
  font-size: 14px;
}

.registered-workers {
  margin-top: 30px;
}

.registered-workers h3 {
  margin-bottom: 15px;
  color: #333;
}

.worker-item {
  padding: 15px;
  background-color: #f9f9f9; /* Default background color */
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

.worker-item--alt {
  background-color: #f1f1f1; /* Alternate background color */
}

.worker-item:hover {
  background-color: #e9e9e9;
}

.worker-item h3 {
  margin: 0;
}

.worker-item p {
  margin: 5px 0 0;
}
</style>
