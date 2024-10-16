<template>
  <div id="app">
    <!-- Navigations-Tabs -->
    <Tabs />

    <!-- Haupt-Inhalt -->
    <router-view />
  </div>
</template>

<script>
import Tabs from '@/components/Tabs.vue';
import { onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  components: {
    Tabs,
  },
  setup() {
    const store = useStore();

    // Registriere den Admin-Worker beim Mounten der App
    onMounted(() => {
      store.dispatch('registerAdminWorker');
    });

    return {};
  },
};
</script>

<style>
/* Globale Styles können hier definiert werden */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.router-view {
  flex: 1;
  padding: 20px;
}

/* Optional: Weitere globale Styles */
</style>
