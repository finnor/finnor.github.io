<template>
  <footer>
    <div class="col-sm-12 text-center text-brand-secondary">
      <p>
        Copyright © {{ this.year }} Adrian Flannery • Birmingham, AL based Software Developer
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      year: new Date().getFullYear()
    }
  },
}
</script>