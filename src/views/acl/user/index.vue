<template>
  <div>
    <el-card>
      <el-form inline class="search-form">
        <el-form-item label="用户名：">
          <el-input v-model="username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button type="default">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-table :data="tableData" border style="margin: 10px 0">
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" type="index" label="#" width="80" />
        <el-table-column align="center" label="id" />
        <el-table-column align="center" label="用户名称" />
        <el-table-column align="center" label="用户角色" />
        <el-table-column align="center" label="创建时间" />
        <el-table-column align="center" label="更新时间" />
        <el-table-column align="center" label="操作" />
      </el-table>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11, 13]" :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="400" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserListResponseData } from '@/api/acl/user/type'
import { reqGetUserList } from '@/api/acl/user'

// 定义用户名变量
const username = ref<string>('')

// 定义表格数据
const tableData = ref<any[]>([])

// 定义分页器相关变量
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)

// 获取用户列表。pager 当前页码，不传默认值为 1
const getUserList = async (pager = 1) => {
  currentPage.value = pager
  const result: UserListResponseData = await reqGetUserList(currentPage.value, pageSize.value)
  console.log('result', result)
  if (result.code === 200) {
    tableData.value = result.data.records
    total.value = result.data.total
  }
}

onMounted(() => {
  getUserList()
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 400px;
  background-color: bisque;

  .search-form {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
  }
}
</style>
