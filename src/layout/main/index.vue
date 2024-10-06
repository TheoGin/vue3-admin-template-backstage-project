<template>
  <!-- 路由组件出口的位置。把组件{ Component }注入进来 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/module/setting'
import { nextTick, ref, watch } from 'vue'

let flag = ref(true)
const layoutSettingStore = useLayoutSettingStore()
watch(
  () => layoutSettingStore.refresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
  // transform: rotate(0deg);
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1); // 缩放
  // transform: rotate(360deg); // 旋转360度
}
</style>
