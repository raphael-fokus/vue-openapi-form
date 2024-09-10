<template>
  <div class="execution-list-container">
    <h1>Executions</h1>
    <execution-list />
  
    <!-- Button with an icon pointing to Job Listing -->
    <button @click="goToJobListing" class="icon-button">
      <i class="fa fa-arrow-left"></i>
      <span class="tooltip">Jobs & Scheduling</span>
    </button>
  </div>
</template>

<script>
import ExecutionList from './ExecutionList.vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    ExecutionList
  },
  setup() {
    const router = useRouter();

    const goToJobListing = () => {
      router.push({ name: 'JobListing' });
    };

    return {
      goToJobListing
    };
  }
};
</script>

<style scoped>
.execution-list-container {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.icon-button {
  position: relative;
  background-color: #176bb5;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: auto;
  margin-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.tooltip {
  position: absolute;
  top: -30px;
  left: 50px;
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}
</style>
