<template>
  <b-navbar ref="navFloating" toggleable="lg" type="dark" variant="brand-primary-gradient" :sticky="isSticky || !isFloating" :class="[(!isSticky && isFloating) ? 'nav-floating' : 'navbar-fixed-top']">
    <div class="container">
      <b-navbar-brand :to="{ name: 'Home'}">Adrian Flannery</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/minesweeper-js">MinesweeperJS</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>


<script>
export default {
  name: 'AppNav',
  data() {
    return {
      isFloating: false,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent)
    }
  },
  props: {
    isSticky: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    determineFloating() {
      let winHeight = window.innerHeight;
      let navHeight = this.$refs.navFloating.$el.offsetHeight;
      this.isFloating = document.querySelector("html").scrollTop <= (winHeight - navHeight)
    }
  },
  mounted() {
    if (this.isSticky || this.isIOS) {
      this.isFloating = false;
    } else {
      this.determineFloating();
    }
  },
  created () {
    if (!this.isSticky || !this.isIOS) {
      window.addEventListener('scroll', this.determineFloating);
    }
  },
  destroyed () {
    if (!this.isSticky || !this.isIOS) {
      window.addEventListener('scroll', this.determineFloating);
    }
  },
}
</script>