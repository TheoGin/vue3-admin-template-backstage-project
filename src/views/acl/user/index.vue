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
      <el-button type="primary" icon="Plus" @click="handleAddUser">
        添加用户
      </el-button>
      <el-button type="danger" icon="Delete">批量删除</el-button>
      <el-table :data="tableData" border style="margin: 10px 0">
        <el-table-column type="selection" width="40" />
        <el-table-column
          align="center"
          type="index"
          label="#"
          width="45"
          prop="id"
        />
        <el-table-column align="center" label="id" prop="id" width="80" />
        <el-table-column
          align="center"
          label="用户名称"
          prop="username"
          width="100"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="用户角色"
          prop="roleName"
          width="270"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          width="180"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          label="更新时间"
          prop="updateTime"
          width="180"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="center" label="操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="handleAssignRole(row)"
            >
              分配角色
            </el-button>
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              @click="handleEditUser(row)"
            >
              编辑
            </el-button>
            <el-button type="danger" size="small" icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 9, 11, 13]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @current-change="getUserList"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!-- 添加和编辑用户姓名、昵称、角色抽屉 -->
    <el-drawer v-model="drawer" title="添加用户" size="50%">
      <!-- 抽屉头部 -->
      <template #header>
        <!-- 需要动态展示 -->
        <h3>{{ userParamsForm.id ? '编辑用户' : '添加用户' }}</h3>
      </template>
      <!-- 抽屉主体 -->
      <el-form
        :model="userParamsForm"
        :rules="userParamsRules"
        ref="userParamsFormRef"
      >
        <el-form-item label="用户姓名" prop="username">
          <el-input
            v-model="userParamsForm.username"
            placeholder="请输入用户姓名"
          />
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            v-model="userParamsForm.name"
            placeholder="请输入用户昵称"
          />
        </el-form-item>
        <el-form-item
          label="用户密码"
          prop="password"
          v-if="!userParamsForm.id"
        >
          <el-input
            v-model="userParamsForm.password"
            placeholder="请输入用户密码"
          />
        </el-form-item>
      </el-form>
      <!-- 抽屉底部 -->
      <template #footer>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
        <el-button type="default" @click="handleCancel">取消</el-button>
      </template>
    </el-drawer>
    <!-- 分配角色抽屉 -->
    <el-drawer v-model="assignRoleDrawer" :direction="direction">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <div>
          <el-form>
            <el-form-item label="用户姓名">
              <el-input v-model="userParamsForm.username" :disabled="true" />
            </el-form-item>
            <el-form-item label="职位列表">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              >
                全选
              </el-checkbox>
              <el-checkbox-group
                v-model="checkedRoleList"
                @change="handlecheckedRoleListChange"
              >
                <el-checkbox
                  v-for="role in allRoleList"
                  :key="role.id"
                  :label="role.roleName"
                >
                  {{ role.roleName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import type { UserListResponseData, User, AllRole, AssignRoleResponseData, Role } from '@/api/acl/user/type'
import { reqGetUserList, reqAddOrUpdateUser, reqAssignRoleListAndAllRoleList } from '@/api/acl/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormRules, FormInstance, DrawerProps } from 'element-plus'
// 定义用户名变量
const username = ref<string>('')

// 定义表格数据
const tableData = ref<User[]>([])

// 定义分页器相关变量
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)

// 定义抽屉变量
const drawer = ref<boolean>(false)
// 收集用户表单数据
const userParamsForm = reactive<User>({
  username: '',
  password: '',
  name: '',
})

// 定义表单ref
const userParamsFormRef = ref<FormInstance>()

// 定义分配角色弹窗变量
const assignRoleDrawer = ref<boolean>(false)
const direction = ref<DrawerProps['direction']>('rtl')
const radio1 = ref('Option 1')

// 处理添加用户
const handleAddUser = () => {
  // 清空表单数据
  Object.assign(userParamsForm, {
    id: 0,
    username: '',
    password: '',
    name: '',
  })
  drawer.value = true

  // 清空表单验证
  nextTick(() => {
    userParamsFormRef.value?.clearValidate('username')
    userParamsFormRef.value?.clearValidate('password')
    userParamsFormRef.value?.clearValidate('name')
  })
}

// 处理编辑用户
const handleEditUser = (row: User) => {
  drawer.value = true
  // 将行数据赋值给表单数据
  Object.assign(userParamsForm, row)
}

// 获取用户列表。pager 当前页码，不传默认值为 1
const getUserList = async (pager = 1) => {
  currentPage.value = pager
  const result: UserListResponseData = await reqGetUserList(
    currentPage.value,
    pageSize.value,
  )
  // console.log('result', result)
  if (result.code === 200) {
    tableData.value = result.data.records
    total.value = result.data.total
  }
}

// 处理分页器页码变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  getUserList()
}

// 处理确定按钮
const handleConfirm = async () => {
  // 表单验证
  await userParamsFormRef.value?.validate()

  const result: any = await reqAddOrUpdateUser(userParamsForm)
  console.log('result', result)
  if (result.code === 200) {
    // 添加或更新成功
    ElMessage.success(userParamsForm.id ? '更新用户成功' : '添加用户成功')
    // 关闭抽屉
    drawer.value = false
    // // 重新获取用户列表。如果存在id，则停留在当前页，否则跳到第一页
    // getUserList(userParamsForm.id ? currentPage.value : 1)
    // 浏览器刷新一次
    window.location.reload()
  } else {
    // 关闭抽屉
    drawer.value = false
    // 添加或更新失败
    ElMessage.error(userParamsForm.id ? '更新用户失败' : '添加用户失败')
  }
}

// 处理取消按钮
const handleCancel = () => {
  drawer.value = false
}

// 校验用户名
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value.length < 5 || value.length > 18) {
    callback(new Error('用户名长度必须在5-18位之间'))
  } else {
    callback()
  }
}

// 校验密码
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.length < 6 || value.length > 18) {
    callback(new Error('密码长度必须在6-18位之间'))
  } else {
    callback()
  }
}

// 校验昵称
const validateName = (rule: any, value: any, callback: any) => {
  if (value.length < 5 || value.length > 10) {
    callback(new Error('昵称长度必须在5-10位之间'))
  } else {
    callback()
  }
}

// 定义表单验证规则
const userParamsRules = reactive<FormRules>({
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
  name: [{ required: true, trigger: 'blur', validator: validateName }],
})

onMounted(() => {
  getUserList()
})

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
function cancelClick() {
  assignRoleDrawer.value = false
}
function confirmClick() {
  ElMessageBox.confirm(`Are you confirm to chose ${radio1.value} ?`)
    .then(() => {
      assignRoleDrawer.value = false
    })
    .catch(() => {
      // catch error
    })
}
// 处理分配角色
const handleAssignRole = async (row: User) => {
  console.log('row', row)
  // 将行数据赋值给表单数据
  Object.assign(userParamsForm, row)
  // 获取所有角色列表
  const result: AssignRoleResponseData = await reqAssignRoleListAndAllRoleList(row.id)
  console.log('result', result)
  if (result.code === 200) {
    allRoleList.value = result.data.allRolesList
    checkedRoleList.value = result.data.assignRoles.map((role: Role) => role.roleName)
    
    // 更新全选和半选状态
    const checkedCount = checkedRoleList.value.length
    checkAll.value = checkedCount === allRoleList.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRoleList.value.length
  }

  // 打开分配角色抽屉
  assignRoleDrawer.value = true
}
// 全选和半选
const checkAll = ref(false)
// 是否半选
const isIndeterminate = ref(true)
// 职位列表
const checkedRoleList = ref<string[]>([])
// 所有职位列表
const allRoleList = ref<AllRole>([])
// 处理全选和半选
const handleCheckAllChange = (val: boolean) => {
  console.log('val', val)
  // 获取所有角色的 roleName 作为选中值
  checkedRoleList.value = val ? allRoleList.value.map((item: AllRole) => item.roleName) : []
  isIndeterminate.value = false
}
// 处理半选
const handlecheckedRoleListChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRoleList.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRoleList.value.length
}
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