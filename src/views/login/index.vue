v3
<template>
  <div class="login_container">
    <el-row>
      <!-- xs	<768px 响应式栅格数或者栅格属性对象 -->
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录的表单 -->
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到Vue3通用后台管理系统</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              v-model="loginForm.password"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="login_btn"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/module/user'
import { ElNotification } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { getTime } from '@/utils/time'
//收集账号与密码的数据
const loginForm = reactive({ username: 'admin', password: '111111' })

const validateUsername = (rule: any, value: any, callback: any) => {
  // console.log(/^\d{5,10}$/.test(value));
  // if(/^\d{5, 10}$/.test(value)) {
  if (value.length >= 5) {
    // 放行
    callback()
  } else {
    callback(new Error('用户名长度至少五位'))
  }
}

const validatePassword = (rule: any, value: any, callback: any) => {
  // console.log(callback);
  if (value.length >= 6) {
    // 放行
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}

const rules = {
  username: [
    // { required: true, min: 6, max: 15, message: '用户名至少为6位', trigger: 'change' },
    { validator: validateUsername, trigger: 'change' },
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度至少为6位', trigger: 'change' },
    { validator: validatePassword, trigger: 'change' },
  ],
}

const useStore = useUserStore()
const router = useRouter()
const route = useRoute()

const loginForms = ref()
console.log(loginForms.value)

const login = async () => {
  await loginForms.value.validate()

  try {
    // 或者用.then方法
    await useStore.userLogin(loginForm)
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi，${getTime()}好`,
    })
    // console.log(route.query.redirect);

    //编程式导航跳转到展示数据首页
    //判断登录的时候,路由路径当中是否有query参数，如果有就往query参数挑战，没有跳转到首页
    const redirect: any = route.query.redirect
    // console.log('redirect', redirect);
    router.push({ path: redirect || '/' })
  } catch (error) {
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  // 覆盖整个容器
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
  }

  h1 {
    font-size: 40px;
    color: #fff;
  }

  h2 {
    font-size: 20px;
    color: #fff;
    margin: 20px 0;
  }

  .login_btn {
    width: 100%;
  }
}
</style>
