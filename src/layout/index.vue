<template>
  <div class="layout_container">
    <!-- <div class="layout_slider" :class="{fold: layoutSettingStore.fold}"> -->
    <div class="layout_slider">
      <Logo />
      <!-- 左侧菜单栏 -->
      <el-scrollbar class="scroll_bar">
        <!-- menu -->
        <el-menu
          :collapse="layoutSettingStore.fold ? true : false"
          :default-active="route.path"
          background-color="#001529"
          text-color="#fff"
          active-text-color="yellowgreen"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div
      class="layout_tabbar"
      :class="{ fold: layoutSettingStore.fold ? true : false }"
    >
      <!-- layout组件的顶部导航tabbar -->
      <Tabbar />
    </div>
    <!-- 右侧主体内容展示区域 -->
    <div
      class="layout_main"
      :class="{ fold: layoutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
// 引入主体内容组件
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import useUserStore from '@/store/module/user.ts'
import { useRoute } from 'vue-router'
import useLayoutSettingStore from '@/store/module/setting'
const userStore = useUserStore()

const route = useRoute()
// console.log(route.path);

const layoutSettingStore = useLayoutSettingStore()
</script>
<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  // background-color: aquamarine;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;

    .scroll_bar {
      height: calc(100vh - $base-menu-logo-height);
      color: #fff;
    }
    .el-menu {
      border-right: none;
    }

    // 与layout_slider写在同个标签里，如果有fold这个类名
    // &.fold {
    //     width: $base-menu-min-width;
    // }
  }

  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    // background: greenyellow;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background: cyan;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
