import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: () => ({
    adminWorkerId: '',
    executions: [],
    workers: [],
    jobs: [],
    workerLogs: {},
    socket: null,
  }),
  getters: {
    executions: (state) => state.executions,
    workers: (state) => state.workers,
    jobs: (state) => state.jobs,
    getWorkerLogs: (state) => (workerId) => state.workerLogs[workerId] || [], 
  },
  mutations: {
    SET_ADMIN_WORKER_ID(state, workerId) {
      state.adminWorkerId = workerId;
    },
    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
    // Workers
    SET_WORKERS(state, workers) {
      state.workers = workers;
    },
    UPDATE_WORKER(state, worker) {
      const index = state.workers.findIndex((w) => w.workerId === worker.workerId);
      if (index !== -1) {
        state.workers.splice(index, 1, worker);
      } else {
        state.workers.push(worker);
      }
    },
    REMOVE_WORKER(state, workerId) {
      const index = state.workers.findIndex((w) => w.workerId === workerId);
      if (index !== -1) {
        state.workers.splice(index, 1);
      }
    },
    // Jobs
    SET_JOBS(state, jobs) {
      state.jobs = jobs;
    },
    UPDATE_JOB(state, job) {
      const index = state.jobs.findIndex((j) => j.jobId === job.jobId);
      if (index !== -1) {
        state.jobs.splice(index, 1, job);
      } else {
        state.jobs.push(job);
      }
    },
    REMOVE_JOB(state, jobId) {
      const index = state.jobs.findIndex((j) => j.jobId === jobId);
      if (index !== -1) {
        state.jobs.splice(index, 1);
      }
    },
    // Executions
    SET_EXECUTIONS(state, executions) {
      state.executions = executions;
    },
    UPDATE_EXECUTION(state, execution) {
      const index = state.executions.findIndex(e => e.executionId === execution.executionId);
      if (index !== -1) {
        state.executions.splice(index, 1, execution);
      } else {
        state.executions.push(execution);
      }
    },
    REMOVE_EXECUTION(state, executionId) {
      const index = state.executions.findIndex((e) => e.executionId === executionId);
      if (index !== -1) {
        state.executions.splice(index, 1);
      }
    },
    // Logs
    ADD_WORKER_LOG(state, { workerId, log }) {
      if (!state.workerLogs[workerId]) {
        state.workerLogs[workerId] = [];
      }
      state.workerLogs[workerId].push(log);
    },
  },
  actions: {
    async connectWorker({ commit, state }, worker) {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = window.location.host.replace('3000', '3003'); // Adjust the port if needed
        const path = '/v1/connection';
        const wsUrl = `${protocol}${host}${path}?workerId=${worker.workerId}`;
        
        // Check if the worker is already connected
        const existingWorker = state.workers.find(w => w.workerId === worker.workerId && w.connected);
        if (existingWorker) {
          console.log(`Worker ${worker.workerName} is already connected.`);
          return;
        }
    
        const socket = new WebSocket(wsUrl);
    
        socket.onopen = () => {
          commit('UPDATE_WORKER', { ...worker, connected: true });
          console.log(`Worker ${worker.workerName} connected successfully!`);
        };
    
        socket.onclose = () => {
          commit('UPDATE_WORKER', { ...worker, connected: false });
          console.warn(`Worker ${worker.workerName} disconnected. Attempting to reconnect...`);
          setTimeout(() => {
            this.dispatch('connectWorker', worker);
          }, 3000); // Retry after 3 seconds
        };
    
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          commit('UPDATE_WORKER', { ...worker, connected: false });
        };
    
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('Worker WebSocket message received:', data);
        };
    
        // Update the socket reference in state if needed
        commit('SET_SOCKET', socket);
    
      } catch (error) {
        console.error('Error connecting worker:', error);
      }
    }
    ,
    async removeWorker({ commit }, workerId) {
      try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/v1/registration/${workerId}`);
        commit('REMOVE_WORKER', workerId);
      } catch (error) {
        console.error('Failed to remove worker:', error);
        throw error;
      }
    },
    async executeJob({ commit }, { job, scheduledDate }) {
      // Validate the job object before proceeding
      if (!job || !job.tasks || job.tasks.length === 0) {
        console.error('Invalid job: No tasks provided.');
        throw new Error('Invalid job: No tasks provided.');
      }
    
      // Check that each task has a valid stream URL
     // for (const task of job.tasks) {
     //   if (!task.stream || !task.stream.url) {
     //     console.error(`Invalid stream data for task: ${task.action}`);
        //  throw new Error(`Invalid stream data for task: ${task.action}`);
      //  }
     // }
    
      // Construct the payload for the API request
      const payload = {
        job,
        scheduledDate: scheduledDate || new Date().toISOString(),
      };
    
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/v1/execution`, payload);
        commit('UPDATE_EXECUTION', response.data);  
        console.log('Job scheduled successfully');
      } catch (error) {
        console.error('Failed to execute job:', error);
        throw error; 
      }
    },
    async registerAdminWorker({ commit, dispatch }) {
      let workerId = localStorage.getItem('admin-workerId');
      if (workerId) {
        // Verify if worker is registered
        try {
          await axios.get(`${import.meta.env.VITE_BASE_URL}/v1/registration/${workerId}`);
          commit('SET_ADMIN_WORKER_ID', workerId);
          dispatch('connectWebSocket');
        } catch (error) {
          console.error('Error verifying admin worker:', error);
          localStorage.removeItem('admin-workerId');
          workerId = null;
        }
      }
    
      if (!workerId) {
        // Register new admin worker
        try {
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/v1/registration`, {
            workerType: 'ADMIN',
          });
          workerId = response.data.workerId;
          localStorage.setItem('admin-workerId', workerId);
          commit('SET_ADMIN_WORKER_ID', workerId);
          dispatch('connectWebSocket');
        } catch (error) {
          console.error('Error registering admin worker:', error);
        }
      }
    },
    connectWebSocket({ state, commit, dispatch }) {
      if (!state.adminWorkerId) {
        console.error('Admin worker ID not set.');
        return;
      }
    
      const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
      const host = window.location.host.replace('3000', '3003'); // Adjust the port if needed
      const path = '/v1/connection';
      const wsUrl = `${protocol}${host}${path}?workerId=${state.adminWorkerId}`;
    
      const socket = new WebSocket(wsUrl);
      commit('SET_SOCKET', socket);
    
      // Capture `dispatch` and `commit` in variables to ensure they are accessible
      const storeDispatch = dispatch;
      const storeCommit = commit;
    
      socket.onopen = () => {
        console.log('WebSocket connected');
        storeDispatch('fetchInitialData');
      };
    
      socket.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
          storeDispatch('processWebSocketMessage', data);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };
    
      socket.onclose = (event) => {
        console.warn('WebSocket closed', event.reason);
        // Attempt to reconnect after a short delay
        setTimeout(() => {
          console.log('Reconnecting WebSocket...');
          storeDispatch('connectWebSocket');
        }, 3000); // Reconnect after 3 seconds
      };
    
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    },
    processWebSocketMessage({ commit }, data) {
      // Check if this is a system message
      if (data.message) {
        console.log('System message received:', data.message);
        return; // Early return since it's not an application-level message
      }
    
      // Check for payload to proceed with application-specific processing
      if (!data.payload) {
        console.error('Invalid WebSocket message format:', data);
        return;
      }
    
      const payload = data.payload;
      console.log('Extracted payload:', payload);
    
      if (!payload.action) {
        console.error('Missing action in WebSocket message:', payload);
        return;
      }
    
      switch (payload.action) {
        case 'workerUpdate':
          payload.values.forEach((worker) => {
            commit('UPDATE_WORKER', worker);
          });
          break;
        case 'jobUpdate':
          payload.values.forEach((job) => {
            commit('UPDATE_JOB', job);
          });
          break;
        case 'executionUpdate':
          payload.values.forEach((execution) => {
            commit('UPDATE_EXECUTION', execution);
          });
          break;
        case 'workerLog':  
          payload.values.forEach((logEntry) => {
            commit('ADD_WORKER_LOG', { workerId: logEntry.workerId, log: logEntry.log });
          });
          break;
        default:
          console.warn('Unknown action:', payload.action);
      }
    },
    async fetchInitialData({ dispatch }) {
      // Fetch workers, jobs, and executions
      await dispatch('fetchWorkers');
      await dispatch('fetchJobs');
      await dispatch('fetchExecutions');
    },
    async fetchWorkers({ commit }) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/v1/registration`);
        commit('SET_WORKERS', response.data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    },
    async fetchJobs({ commit }) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/v1/measurement`);
        commit('SET_JOBS', response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    },
    async fetchExecutions({ commit }) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/v1/execution`);
        commit('SET_EXECUTIONS', response.data);
      } catch (error) {
        console.error('Error fetching executions:', error);
      }
    },
  },
  modules: {},
});

export default store;
