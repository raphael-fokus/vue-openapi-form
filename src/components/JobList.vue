<template>
  <div class="jobs-container">
    <h2>Available Jobs</h2>
    <div v-if="jobs.length">
      <div v-for="job in jobs" :key="job.jobId" class="listEntry">
        <div class="job-details">
          <div class="job-info">
            <span class="job-name"><strong>{{ job.jobName }}</strong></span>
            <span class="job-id"><i>({{ job.jobId }})</i></span>
            
            <!-- Check if streams exist before accessing length -->
            <p>Contents: {{ job.streams ? job.streams.length : 0 }}, Tasks: {{ job.tasks ? job.tasks.length : 0 }}</p>

            <p class="task-sequence">
              Task Sequence:
              <span v-for="(task, index) in job.tasks" :key="task.worker.workerId">
                {{ task.worker.workerType }}/{{ task.action }}<span v-if="!isLastTask(index, job.tasks)">, </span>
              </span>
            </p>
          </div>
          <div class="job-actions">
            <!-- Schedule Job button -->
            <button @click="scheduleJob(job)" class="button is-primary">Schedule Job</button>

            <!-- Remove Job button -->
            <button @click="removeJob(job.jobId)" class="button is-danger ml-10">Remove Job</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-jobs">
      <p>No jobs available.</p>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup(props, { emit }) {
    const store = useStore();
    const toast = useToast();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const jobs = computed(() => store.getters.jobs);

    const scheduleJob = (job) => {
      // Emit an event to the parent component to handle scheduling
      emit('schedule-job', job);
    };

    const removeJob = (jobId) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this job?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${baseUrl}/v1/measurement/${jobId}`)
            .then(() => {
              store.commit('REMOVE_JOB', jobId);
              toast.success('Job removed successfully');
            })
            .catch((error) => {
              console.error('Error removing job:', error);
              toast.error('Failed to remove the job. Please try again.');
            });
          Swal.fire('Removed!', 'The job has been removed.', 'success');
        }
      });
    };

    const isLastTask = (index, tasks) => {
      return index === tasks.length - 1;
    };

    return {
      jobs,
      scheduleJob,
      removeJob,
      isLastTask,
    };
  },
};
</script>


<style scoped>
.jobs-container {
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

.job-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.job-name {
  margin-right: 5px;
}

.job-info {
  max-width: 70%;
}

.job-info strong {
  font-size: 18px;
  color: #333;
}

.job-info p {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 14px;
}

.task-sequence {
  margin-top: 5px;
  color: #555;
  font-style: italic;
  font-size: 13px;
}

.job-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.button {
  padding: 10px 20px;
  font-size: 14px;
}

.ml-10 {
  margin-left: 10px;
}

.no-jobs {
  text-align: center;
  color: #666;
}
</style>
