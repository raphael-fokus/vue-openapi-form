<!-- src/components/Worker.vue -->
<template>
    <div class="worker">
      <p><strong>{{ worker.workerName }} ({{ worker.workerType }})</strong></p>
      <p>Status: {{ connectionStatus }}</p>
      <div v-if="currentTask">
        <p>Executing task: {{ currentTask.action }}</p>
        <p>Task progress: {{ taskProgress }}</p>
      </div>
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
    data() {
      return {
        socket: null,
        connectionStatus: "disconnected",
        currentTask: null,
        taskProgress: 0,
      };
    },
    created() {
      this.connectToWorker();
    },
    methods: {
      connectToWorker() {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = window.location.host.replace('3000', '3003');
        const path = '/v1/connection';
        const wsUrl = `${protocol}${host}${path}?workerId=${this.worker.workerId}`;
  
        this.socket = new WebSocket(wsUrl);
  
        this.socket.onopen = () => {
          this.connectionStatus = "connected";
          this.$emit('worker-connected', this.worker);
        };
  
        this.socket.onclose = () => {
          this.connectionStatus = "disconnected";
          this.$emit('worker-disconnected', this.worker);
        };
  
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.payload && data.payload.action === 'executeTask') {
            this.handleTaskExecution(data.payload.values);
          }
        };
  
        this.socket.onerror = () => {
          this.connectionStatus = "error";
        };
      },
      handleTaskExecution(task) {
        this.currentTask = task;
        this.taskProgress = 0;
  
        // Simulate task progress
        const interval = setInterval(() => {
          if (this.taskProgress >= 100) {
            clearInterval(interval);
            this.completeTask();
          } else {
            this.taskProgress += 20;
          }
        }, 1000);
      },
      completeTask() {
        this.socket.send(JSON.stringify({
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
        }));
        this.currentTask = null;
        this.taskProgress = 0;
      },
    },
  };
  </script>
  
  <style scoped>
  .worker {
    background-color: #f9f9f9;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  </style>
  