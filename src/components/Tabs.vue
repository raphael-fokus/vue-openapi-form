<template>
  <div class="tabs is-line">
    <ul>
      <li :class="{ 'is-active': $route.name === 'Home' }">
        <router-link to="/">
          <span class="icon is-small">
            <i class="fa fa-home" aria-hidden="true"></i>
          </span>
          <span>Home</span>
        </router-link>
      </li>
      <li :class="{ 'is-active': $route.name === 'JobListing' }">
        <router-link to="/jobs">
          <span class="icon is-small">
            <i class="fa fa-list" aria-hidden="true"></i>
          </span>
          <span>Jobs</span>
        </router-link>
      </li>
      <li :class="{ 'is-active': $route.name === 'Workers' }">
        <router-link to="/workers">
          <span class="icon is-small">
            <i class="fa fa-users" aria-hidden="true"></i>
          </span>
          <span>Workers</span>
        </router-link>
      </li>
      <li :class="{ 'is-active': $route.name === 'ExecutionList' }">
        <router-link to="/executions">
          <span class="icon is-small">
            <i class="fa fa-play" aria-hidden="true"></i>
          </span>
          <span>Executions</span>
        </router-link>
      </li>
      <!-- Optional: GitHub Link -->
      <li class="github-link">
        <a href="https://github.com/raphael-fokus/vue-openapi-form" target="_blank">
          <span class="icon is-small">
            <i class="fa fa-github" aria-hidden="true"></i>
          </span>
          <span>GitHub</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
};
</script>

<style scoped>
.tabs {
  background-color: #f5f5f5;
  padding: 10px 20px;
}

.tabs ul {
  display: flex;
  align-items: center;
}

.tabs li {
  margin-right: 20px;
}

.tabs li a {
  display: flex;
  align-items: center;
  padding: 10px;
  color: #333;
  text-decoration: none;
}

.tabs li a:hover {
  background-color: #ddd;
  border-radius: 4px;
}

.tabs li.is-active a {
  background-color: #176bb5;
  color: white;
  border-radius: 4px;
}

.icon {
  margin-right: 5px;
}

.github-link {
  margin-left: auto; 
}
</style>
