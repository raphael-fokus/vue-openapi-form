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

    <!-- Draggable List of Workers -->
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
            <input type="text" v-model="element.refSettingId" placeholder="refSettingId"
              class="input is-primary ref-setting-input" />
          </div>
          <div class="worker-actions">
            <button v-if="!element.connected" @click="connectWorker(element)" class="button is-primary">
              Connect
            </button>
            <button @click="removeWorker(element.workerId)" class="button is-danger ml-10">
              Remove
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
import { computed } from 'vue';
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
        .sort((a, b) => (a.connected === b.connected ? 0 : a.connected ? -1 : 1));
    });

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

    const removeWorker = (workerId) => {
      if (confirm('Are you sure you want to remove this worker?')) {
        store
          .dispatch('removeWorker', workerId)
          .then(() => {
            toast.success('Worker removed successfully.');
          })
          .catch(() => {
            toast.error('Failed to remove worker.');
          });
      }
    };

    return {
      sortedWorkers,
      connectWorker,
      removeWorker,
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
  justify-content: space-between;
  align-items: center;
  width: 70%;
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

.ref-setting-input {
  width: 275px;
  margin-top: 10px;
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
