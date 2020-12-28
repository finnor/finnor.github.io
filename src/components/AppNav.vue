<template>
  <b-navbar ref="navFloating" toggleable="lg" type="dark" variant="brand-primary-gradient" :sticky="!isFloating" :class="[(isFloating) ? 'nav-floating' : 'navbar-fixed-top']">
    <div class="container">
      <b-navbar-brand :to="{ name: 'Home'}">Adrian Flannery</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/DNAAlignment">DNAAlignmentXY</b-nav-item>
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
    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (iOS) {
      this.isFloating = false;
    } else {
      this.determineFloating();
    }
  },
  created () {
    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!iOS) {
      window.addEventListener('scroll', this.determineFloating);
    }
  },
  destroyed () {
    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!iOS) {
      window.addEventListener('scroll', this.determineFloating);
    }
  },
}
</script>