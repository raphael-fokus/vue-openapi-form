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

    <!-- Render the Worker component after registration -->
    <Worker v-if="registeredWorker" :worker="registeredWorker" />
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
      registeredWorker: null,
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

      // Generate a new workerId for each registration
      this.newWorker.workerId = uuidv4();

      axios
        .post(`${this.baseUrl}/v1/registration`, this.newWorker)
        .then((response) => {
          const workerData = response.data;
          this.stateMessage = 'Worker registered successfully!';
          this.registeredWorker = workerData; // Store the worker data
          this.newWorker.workerId = ''; // Clear the workerId field for new registrations
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
  background-color: #f9f9f9;
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
</style>
