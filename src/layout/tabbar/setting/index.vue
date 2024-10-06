<template>
  <el-button
    size="small"
    circle
    icon="Refresh"
    @click="handleRefresh"
  ></el-button>
  <el-button
    size="small"
    circle
    icon="FullScreen"
    @click="handleFullScreen"
  ></el-button>
  <el-button size="small" circle icon="Setting"></el-button>
  <img
    :src="userStore.avatar"
    alt=""
    style="width: 24px; height: 24px; border-radius: 50%; margin: 0 10px"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/module/setting'
import useUserStore from '@/store/module/user'
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore()
const layoutSettingStore = useLayoutSettingStore()
const router = useRouter()
const route = useRoute()

const handleRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
// 全屏按钮点击的回调
const handleFullScreen = () => {
  //DOM对象的一个属性:可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
  const full = document.fullscreenElement
  //切换为全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //变为不是全屏模式->退出全屏模式
    document.exitFullscreen()
  }
}
// 退出登录点击的回调
const logout = () => {
  //第一件事情:需要向服务器发请求[退出登录接口]******
  //第二件事情:仓库当中关于用于相关的数据清空[token|username|avatar]
  //第三件事情:跳转到登录页面
  userStore.userLogout()
  // console.log(route);
  // 跳转到登录页面
  router.push({ path: '/login', query: { redirect: route.path } })
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
