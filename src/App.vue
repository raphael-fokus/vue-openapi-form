<template>
  <div id="app">
    <!-- Navigations-Tabs -->
    <Tabs />

    <!-- Haupt-Inhalt -->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
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

    onMounted(() => {
      store.dispatch('registerAdminWorker');
    });

    return {};
  },
};
</script>

<style lang="scss">
@import 'font-awesome/css/font-awesome.min.css';
@import './assets/scss/main.scss';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
