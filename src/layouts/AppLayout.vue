<template>
  <div>
    <app-nav :is-sticky="true" />
    <slot/>
    <app-footer class="mt-5"/>
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue'
import AppNav from '@/components/AppNav.vue'
export default {
  name: 'AppLayout',
  components: { AppNav, AppFooter },
}
</script>