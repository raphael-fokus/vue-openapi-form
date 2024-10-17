<template>
  <div class="workers-container">
    <h2>Workers</h2>

    <!-- Legend for worker status -->
    <div class="worker-legend">
      <p>
        <strong>Legend:</strong> Registered
        <span class="icon-warning">⚠️</span>, Registered and Connected
        <span class="icon-connected">✔️</span>
      </p>
    </div>

    <!-- List of Workers -->
    <div v-if="sortedWorkers.length" class="worker-list">
      <div v-for="worker in sortedWorkers" :key="worker.workerId" class="worker-item">
        <!-- Worker Info and Actions -->
        <div class="listEntry" :class="{ connected: worker.connected }">
          <div class="worker-details">
            <div class="worker-info">
              <p>
                <strong>{{ worker.workerType }}:</strong> {{ worker.workerName }}
                <i>({{ worker.workerId }})</i>
                <span v-if="worker.connected || worker.isExecutingTask" class="icon-connected">✔️</span>
                <span v-else class="icon-warning">⚠️</span>
              </p>
            </div>

            <div class="ref-setting-container">
              <input id="refSettingId" type="text" v-model="worker.refSettingId" placeholder="refSettingId"
                class="input is-primary ref-setting-input" />
            </div>
          </div>

          <!-- Worker Actions -->
          <div class="worker-actions">
            <!-- Connect Button -->
            <button v-if="!worker.connected" @click="connectWorker(worker)" class="button is-primary">
              Connect
            </button>

            <!-- Disconnect or Remove Button -->
            <button @click="handleWorkerAction(worker)" :class="[
              'button',
              'ml-10',
              removeConfirmations[worker.workerId] && !worker.connected ? 'is-warning' : 'is-danger',
            ]">
              {{ worker.connected ? 'Disconnect' : 'Remove' }}
              <span v-if="!worker.connected && removeConfirmations[worker.workerId]">?</span>
            </button>
          </div>
        </div>

        <!-- Include the Worker component and listen for events -->
        <Worker :worker="worker" @register-worker-ref="registerWorkerRef"
          @update-connection-status="updateConnectionStatus" ref="workerComponents" />
      </div>
    </div>

    <div v-else class="no-workers">
      No workers available.
    </div>
  </div>
</template>


<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Worker from './Worker.vue';

export default {
  components: {
    Worker,
  },
  setup() {
    const store = useStore();

    const workers = computed(() => store.getters.workers);

    const sortedWorkers = computed(() => {
      return workers.value
        .filter((worker) => worker.workerType !== 'ADMIN')
        .sort((a, b) => {
          if (a.isExecutingTask || a.connected) return -1;
          return 1;
        });
    });

    const removeConfirmations = ref({});

    const workerRefs = ref({});

    const registerWorkerRef = (workerId, componentInstance) => {
      workerRefs.value[workerId] = componentInstance;
    };

    const connectWorker = (worker) => {
      const workerComponent = workerRefs.value[worker.workerId];
      if (workerComponent) {
        workerComponent.connectToWorker();
      }
    };

    const disconnectWorker = (worker) => {
      const workerComponent = workerRefs.value[worker.workerId];
      if (workerComponent) {
        workerComponent.disconnectFromWorker();
      }
    };

    const removeWorker = (workerId) => {
      if (!removeConfirmations.value[workerId]) {
        removeConfirmations.value[workerId] = true;

        setTimeout(() => {
          removeConfirmations.value[workerId] = false;
        }, 5000); // Confirmation timeout
      } else {
        store
          .dispatch('removeWorker', workerId)
          .then(() => {
            // Remove the worker reference
            delete workerRefs.value[workerId];
            delete removeConfirmations.value[workerId];
          })
          .catch((error) => {
            console.error('Failed to remove worker:', error);
          });
      }
    };

    const handleWorkerAction = (worker) => {
      if (worker.connected) {
        disconnectWorker(worker);
      } else {
        removeWorker(worker.workerId);
      }
    };

    const updateConnectionStatus = (workerId, status) => {
      store.commit('UPDATE_WORKER_STATUS', { workerId, status });
    };

    return {
      sortedWorkers,
      connectWorker,
      disconnectWorker,
      removeWorker,
      handleWorkerAction,
      removeConfirmations,
      registerWorkerRef,
      updateConnectionStatus,
    };
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

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
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
  display: flex;
  flex-direction: row;
  width: 70%;
  justify-content: space-between;
}

.worker-info {
  width: 60%;
}

.ref-setting-container {
  width: 40%;
  display: flex;
  flex-direction: column;
}

.ref-setting-input {
  width: 100%;
  margin-top: 5px;
}

.worker-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 30%;
}

.button {
  padding: 10px 20px;
  font-size: 14px;
}

.ml-10 {
  margin-left: 10px;
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

.is-warning {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  50% {
    transform: translateX(4px);
  }

  75% {
    transform: translateX(-4px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
