<template>
  <app-layout>
    <div class="container mt-2">
      <div class="d-flex justify-content-center">
        <div class="bg-brand-tertiary p-3 rounded" ref="mine"> </div>
      </div>
    </div>
  </app-layout>
</template>
<script>
import AppLayout from "@/layouts/AppLayout";
import minesweeperjs from "minesjs";
export default {
  name: 'Minesweeper',
  components: { AppLayout },
  mounted() {
    minesweeperjs(this.$refs.mine);
  }
}
</script>