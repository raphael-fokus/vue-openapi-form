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

    <!-- Draggable List of Workers -->
    <draggable
      v-if="sortedWorkers.length"
      :list="sortedWorkers"
      :options="draggableOptions"
      item-key="workerId"
      class="draggable-worker-list"
    >
      <template #item="{ element }">
        <div class="listEntry" :class="{ connected: element.connected }">
          <div class="worker-details">
            <div class="worker-info">
              <p>
                <strong>{{ element.workerType }}:</strong> {{ element.workerName }}
                <i>({{ element.workerId }})</i>
                <span v-if="element.connected || element.isExecutingTask" class="icon-connected">✔️</span>
                <span v-else class="icon-warning">⚠️</span>
              </p>
            </div>

            <div class="ref-setting-container">
              <input
                id="refSettingId"
                type="text"
                v-model="element.refSettingId"
                placeholder="refSettingId"
                class="input is-primary ref-setting-input"
              />
            </div>
          </div>

          <div class="worker-actions">
            <!-- Connect Button -->
            <button
              v-if="!element.connected"
              @click="connectWorker(element)"
              class="button is-primary"
            >
              Connect
            </button>

            <!-- Disconnect or Remove Button -->
            <button
              @click="handleWorkerAction(element)"
              :class="[
                'button',
                'ml-10',
                removeConfirmations[element.workerId] && !element.connected ? 'is-warning' : 'is-danger',
              ]"
            >
              {{ element.connected ? 'Disconnect' : 'Remove' }}
              <span v-if="!element.connected && removeConfirmations[element.workerId]">?</span>
            </button>
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
import { useToast } from 'vue-toastification';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    draggable,
  },
  setup() {
    const store = useStore();
    const toast = useToast();

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

    const connectWorker = (worker) => {
      store
        .dispatch('connectWorker', worker)
        .then(() => {
          toast.success(`Worker ${worker.workerName} connected successfully!`);
        })
        .catch(() => {
          toast.error('Connection error.');
        });
    };

    const disconnectWorker = (worker) => {
      store
        .dispatch('disconnectWorker', worker)
        .then(() => {
          toast.info(`Worker ${worker.workerName} disconnected successfully.`);
        })
        .catch(() => {
          toast.error('Failed to disconnect worker.');
        });
    };

    const removeWorker = (workerId) => {
      if (!removeConfirmations.value[workerId]) {
        removeConfirmations.value[workerId] = true;

        setTimeout(() => {
          removeConfirmations.value[workerId] = false;
        }, 5000);
      } else {
        store
          .dispatch('removeWorker', workerId)
          .then(() => {
            toast.success('Worker removed successfully.');
            delete removeConfirmations.value[workerId];
          })
          .catch(() => {
            toast.error('Failed to remove worker.');
          });
      }
    };

    // Handle disconnect or remove based on worker status
    const handleWorkerAction = (worker) => {
      if (worker.connected) {
        disconnectWorker(worker);
      } else {
        removeWorker(worker.workerId);
      }
    };

    const cloneWorker = (original) => {
      return { ...original };
    };

    const draggableOptions = {
      group: { name: 'workers', pull: 'clone', put: false },
      sort: false,
      clone: cloneWorker,
    };

    return {
      sortedWorkers,
      connectWorker,
      disconnectWorker,
      removeWorker,
      handleWorkerAction,
      removeConfirmations,
      cloneWorker,
      draggableOptions,
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
