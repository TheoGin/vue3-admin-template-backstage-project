<template>
  <!-- 左侧菜单展开与关闭 -->
  <el-icon style="margin-left: 20px; margin-right: 10px" @click="isCollapse">
    <!-- <Expand /> -->
    <!-- <component :is="fold ? 'Fold' : 'Expand'"></component> -->
    <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 此处不能用v-if，因为vue3中，v-if比v-for优先级更高 -->
    <el-breadcrumb-item
      v-for="(item, index) in route.matched"
      :key="item.path"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
// const fold = ref(false)

import useLayoutSettingStore from '@/store/module/setting'
import { useRoute } from 'vue-router'
const layoutSettingStore = useLayoutSettingStore()

const isCollapse = () => {
  // fold.value = !fold.value
  layoutSettingStore.fold = !layoutSettingStore.fold
}

const route = useRoute()
// console.log(route);
</script>

<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>

<style scoped></style>
