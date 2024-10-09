<template>
    <div class="worker">
      <h3>{{ worker.workerName }} ({{ worker.workerType }})</h3>
      <p>Status: {{ connectionStatus }}</p>
      <div v-if="currentTask">
        <p>Executing task: {{ currentTask.task.action }}</p>
      </div>
      <div id="log">
        <div v-for="logEntry in logs" :key="logEntry.timestamp" class="logEntry">
          {{ logEntry.timestamp }}: {{ logEntry.message }}
        </div>
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
        connectionStatus: 'disconnected',
        currentTask: null,
        currentExecutionHandler: null,
        logs: [],
      };
    },
    created() {
      this.connectToWorker();
    },
    methods: {
      connectToWorker() {
        const workerId = this.worker.workerId;
        if (!workerId) {
          this.connectionStatus = 'Worker ID missing. Please register the worker first.';
          return;
        }
  
        const relPath = window.location.pathname.split('/');
        relPath.pop();
        const wsUrl = `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${
          window.location.host.replace('3000', '3003')
        }${relPath.join('/')}/v1/connection?workerId=${workerId}`;
  
        this.socket = new WebSocket(wsUrl);
  
        this.socket.onopen = () => {
          this.connectionStatus = 'connected';
          this.log('Worker connected via WebSocket');
        };
  
        this.socket.onclose = () => {
          this.connectionStatus = 'disconnected';
          this.log('Worker disconnected. Attempting to reconnect...');
          setTimeout(() => {
            this.connectToWorker();
          }, 3000);
        };
  
        this.socket.onerror = (error) => {
          this.connectionStatus = 'error';
          this.log('WebSocket error: ' + error);
        };
  
        this.socket.onmessage = (event) => {
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
                    // Send abort completion to the manager
                    this.socket.send(
                      JSON.stringify({
                        toWorkerId: 'MANAGER',
                        fromWorkerId: workerId,
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
        };
      },
      handleTaskExecution(taskValues) {
        // Log the task action
        this.log('Executing task: ' + taskValues.task.action);
  
        // If the task is 'playback', send 'syncTime' message
        if (taskValues.task.action === 'playback') {
          // Send 'syncTime' message
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
        }, 10000); // Adjust the duration as needed
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
  