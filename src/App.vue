<template>
  <div id="app" class="bg-brand-primary">
    <app-nav/>
    <router-view/>
    <app-footer/>
  </div>
</template>

<script>
import AppFooter from './components/AppFooter.vue'
import AppNav from './components/AppNav.vue'
export default {
  components: { AppNav, AppFooter },
  
}
</script>