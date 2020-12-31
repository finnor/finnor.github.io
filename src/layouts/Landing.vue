<template>
  <div>
    <app-nav :is-sticky="false" />
    <slot/>
    <app-footer/>
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue'
import AppNav from '@/components/AppNav.vue'
export default {
  name: 'Landing',
  components: { AppNav, AppFooter },
}
</script>