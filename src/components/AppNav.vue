<template>
  <b-navbar toggleable="lg" type="dark" variant="brand-primary">
    <b-navbar-brand href="#">NavBar</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item to="/DNAAlignment">DNAAlignmentXY</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>


<script>
export default {
  name: 'AppNav'
}
</script>