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
      <button @click="$emit('close')" class="button is-danger ml-10">Cancel</button>
    </div>
    <p class="state-message"><strong>State:</strong> {{ stateMessage }}</p>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Worker from './Worker.vue'; 
import { useStore } from 'vuex';
import { ref, reactive } from 'vue';

export default {
  name: 'WorkerRegistration',
  components: {
    Worker,
  },
  setup(props, { emit }) {
    const store = useStore();

    const newWorker = reactive({
      workerType: '',
      workerName: '',
    });

    const registerButtonText = 'Register';
    const stateMessage = ref('Not registered');
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const registerWorker = () => {
      if (!newWorker.workerType || !newWorker.workerName) {
        stateMessage.value = 'Please fill in both worker type and name.';
        return;
      }

      const workerToRegister = {
        ...newWorker,
        workerId: uuidv4(),
      };

      axios
        .post(`${baseUrl}/v1/registration`, workerToRegister)
        .then((response) => {
          const workerData = response.data;
          stateMessage.value = `Worker "${workerData.workerName}" registered successfully!`;

          store.dispatch('addWorker', workerData).then(() => {
            emit('worker-registered', workerData);
          });

          newWorker.workerType = '';
          newWorker.workerName = '';
        })
        .catch((error) => {
          stateMessage.value = 'Failed to register worker.';
          console.error('Error registering worker:', error);
        });
    };

    return {
      newWorker,
      registerButtonText,
      stateMessage,
      registerWorker,
    };
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

.registration-actions .button {
  margin-right: 10px;
}

.state-message {
  margin-top: 10px;
  font-size: 14px;
}

.ml-10 {
  margin-left: 10px;
}
</style>
