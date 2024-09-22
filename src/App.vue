<template>
  <div class="box">
    <h1>我是APP根组件</h1>
  </div>
</template>

<script setup lang="ts">
const str = 'test'
</script>

<style scoped lang="scss">
.box {
  width: 400px;
  height: 200px;
  background-color: aquamarine;
  h1 {
    color: white;
  }
}
</style>
