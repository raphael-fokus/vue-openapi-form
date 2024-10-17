<template>
  <div class="worker-component" style="display: none;">
    <!-- This component is hidden as the display is handled in WorkerList.vue -->
  </div>
</template>

<script>
export default {
  props: {
    worker: {
      type: Object,
      required: true,
    },
  },
  emits: ['register-worker-ref', 'update-connection-status'],
  data() {
    return {
      socket: null,
      connectionStatus: 'disconnected',
      currentTask: null,
      currentExecutionHandler: null,
      logs: [],
    };
  },
  mounted() {
    this.$emit('register-worker-ref', this.worker.workerId, this);
  },
  methods: {
    connectToWorker() {
      const workerId = this.worker.workerId;
      if (!workerId) {
        this.connectionStatus = 'Worker ID missing. Please register the worker first.';
        return;
      }

      const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
      const wsHost = window.location.hostname;
      const wsPort = '3003'; // Adjust if necessary
      const wsPath = '/v1/connection';
      const wsUrl = `${wsProtocol}${wsHost}:${wsPort}${wsPath}?workerId=${workerId}`;

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.connectionStatus = 'connected';
        this.$emit('update-connection-status', this.worker.workerId, 'connected');
        this.log('Worker connected via WebSocket');
      };

      this.socket.onclose = () => {
        this.connectionStatus = 'disconnected';
        this.$emit('update-connection-status', this.worker.workerId, 'disconnected');
        this.log('Worker disconnected.');
      };

      this.socket.onerror = (error) => {
        this.connectionStatus = 'error';
        this.$emit('update-connection-status', this.worker.workerId, 'error');
        this.log('WebSocket error: ' + error);
      };

      this.socket.onmessage = (event) => {
        this.handleSocketMessage(event);
      };
    },
    disconnectFromWorker() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
        this.connectionStatus = 'disconnected';
        this.$emit('update-connection-status', this.worker.workerId, 'disconnected');
        this.log('Worker disconnected.');
      }
    },
    handleSocketMessage(event) {
      let data;
      try {
        data = JSON.parse(event.data);

        if (data.payload) {
          switch (data.payload.action) {
            case 'executeTask':
              const taskValues = data.payload.values;
              this.currentTask = taskValues;
              this.log('Executing task with ' + JSON.stringify(taskValues));

              // Execute the task logic
              this.handleTaskExecution(taskValues);
              break;

            case 'abortTask':
              this.log('Aborting task with ' + JSON.stringify(this.currentTask));
              if (this.currentExecutionHandler) {
                clearTimeout(this.currentExecutionHandler);
              }
              if (this.currentTask) {
                this.socket.send(
                  JSON.stringify({
                    toWorkerId: 'MANAGER',
                    fromWorkerId: this.worker.workerId,
                    payload: {
                      action: 'completeTask',
                      values: {
                        err: 'aborted',
                        executionId: this.currentTask.executionId,
                        taskNo: this.currentTask.taskNo,
                        iterationId: this.currentTask.iterationId,
                      },
                    },
                  })
                );
                this.currentTask = null;
              }
              break;

            case 'syncTime':
              // Implement syncTime logic if required
              break;

            default:
              this.log('Unknown action ' + data.payload.action);
              break;
          }
        }

        if (data.error || data.message) {
          this.log(data.error || data.message);
        }
      } catch (e) {
        this.log('Error receiving message: ' + e);
      }
    },
    handleTaskExecution(taskValues) {
      this.log('Executing task: ' + taskValues.task.action);

      if (taskValues.task.action === 'playback') {
        this.socket.send(
          JSON.stringify({
            toWorkerId: 'MANAGER',
            fromWorkerId: this.worker.workerId,
            payload: {
              action: 'syncTime',
              values: {
                executionId: taskValues.executionId,
                taskNo: taskValues.taskNo,
                iterationId: taskValues.iterationId,
              },
            },
          })
        );
      }

      // Simulate task execution with a timeout
      this.currentExecutionHandler = setTimeout(() => {
        this.completeTask();
      }, 10000);
    },
    completeTask() {
      if (this.socket && this.currentTask) {
        this.socket.send(
          JSON.stringify({
            toWorkerId: 'MANAGER',
            fromWorkerId: this.worker.workerId,
            payload: {
              action: 'completeTask',
              values: {
                executionId: this.currentTask.executionId,
                taskNo: this.currentTask.taskNo,
                iterationId: this.currentTask.iterationId,
              },
            },
          })
        );
        this.log('Task completed: ' + JSON.stringify(this.currentTask));
        this.currentTask = null;
        this.currentExecutionHandler = null;
      }
    },
    log(message) {
      const timestamp = new Date().toISOString();
      this.logs.push({ timestamp, message });
      console.log(`${timestamp}: ${message}`);
    },
  },
};
</script>

<style scoped>
.worker-component {
  display: none; /* Hidden component as UI is handled in WorkerList.vue */
}
</style>
