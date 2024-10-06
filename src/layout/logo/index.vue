<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logoImg" alt="" />
    <p>{{ setting.logoTitle }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting.ts'
</script>

<script lang="ts">
export default {
  name: 'Logo',
}
</script>
<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 10px;

  img {
    width: 40px;
    height: 40px;
  }

  p {
    font-size: $base-menu-logo-fontSize;
    margin-left: 10px;
  }
}
</style>
