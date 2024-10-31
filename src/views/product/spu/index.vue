<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button type="primary" icon="Plus" @click="addSpu">
          添加SPU
        </el-button>
        <el-table border style="margin: 10px 0" :data="hasSpuList">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          />
          <el-table-column label="SPU名称" prop="spuName" />
          <el-table-column
            label="SPU描述"
            prop="description"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                size="small"
                icon="View"
                @click="showSkuList(row)"
              ></el-button>
              <!-- 使用popconfirm组件实现删除前的二次确认，@confirm="deleteSpu(row)"：点击确认按钮时，执行删除SPU操作。注意：删除事件是写在el-popconfirm标签上，而不是el-button标签上 -->
              <el-popconfirm
                :title="`确定要删除${row.spuName}吗？`"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9, 11]"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          :background="true"
          @current-change="getHasSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <!-- 使用ref拿到子组件的实例【面试高频：父组件内部如何拿到子组件的实例VC】 -->
      <SpuForm
        ref="spuFormRef"
        v-show="scene === 1"
        @changeScene="changeScene"
      ></SpuForm>
      <SkuForm
        ref="skuFormRef"
        v-show="scene === 2"
        @changeScene="changeScene"
      ></SkuForm>
      <el-dialog
        :title="skuList.length > 0 ? 'SKU列表' : '该SPU下没有SKU数据'"
        v-model="dialogVisible"
      >
        <el-table border :data="skuList">
          <el-table-column label="SKU名称" prop="skuName" />
          <el-table-column label="SKU价格" prop="price" />
          <el-table-column label="SKU重量" prop="weight" />
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useCategoryStore from '@/store/module/category'
import { reqGetSpuList, reqGetSkuList, reqDeleteSpu } from '@/api/product/spu'
import type { SpuListResponseData, Records } from '@/api/product/spu/type'
import SpuForm from './SpuForm.vue'
import SkuForm from './SkuForm.vue'
import type {
  SPUData,
  SkuData,
  SkuListResponseData,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount } from 'vue'
// 0: SPU分类数据，1：添加或编辑SPU数据，2：添加或编辑SKU数据
let scene = ref<number>(0)
let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)

const categoryStore = useCategoryStore()

// SPU列表
const hasSpuList = ref<Records>([])
// ref可以拿到子组件的实例SpuForm
const spuFormRef = ref()
// nextTick(() => {
//   console.log('spuFormRef', spuFormRef.value);
// })
// console.log('spuFormRef', spuFormRef.value);
// 拿到SkuForm组件的实例
const skuFormRef = ref()
// sku列表
let skuList = ref<SkuData[]>([])
// 对话框是否显示
let dialogVisible = ref<boolean>(false)

// 获取SPU列表
const getHasSpuList = async (pager = 1) => {
  currentPage.value = pager
  let res: SpuListResponseData = await reqGetSpuList(
    currentPage.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  // console.log(res);
  hasSpuList.value = res.data.records
  total.value = res.data.total
}

watch(
  () => categoryStore.c3Id,
  () => {
    // categoryStore.c3Id为空时，表格不应该有数据
    hasSpuList.value = []

    // 监测到categoryStore.c3Id变化，但是为空，不发送网络请求
    if (!categoryStore.c3Id) {
      return
    }
    getHasSpuList()
  },
)

// const handleCurrentChange = () => {
//   getHasSpuList()
// }

const handleSizeChange = () => {
  getHasSpuList()
}

// 添加SPU
const addSpu = () => {
  // 点击添加SPU按钮切换场景为1
  scene.value = 1
  // 初始化添加SKU数据
  spuFormRef.value.initAddSkuData(categoryStore.c3Id)
}

// 编辑SPU
const updateSpu = (row: SPUData) => {
  // 点击添加SPU按钮切换场景为1
  scene.value = 1
  // 初始化修改SPU数据
  spuFormRef.value.initHasSpuData(row)
}

// 添加SKU
const addSku = (row: SPUData) => {
  //点击添加SKU按钮切换场景为2
  scene.value = 2

  // 初始化添加SKU数据
  skuFormRef.value.initAddSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 子组件给父组件传递数据来切换场景。声明ts类型：obj.sceneNum：场景编号，obj.addOrUpdate：添加或修改
const changeScene = (obj: { sceneNum: number; addOrUpdate: string }) => {
  // console.log('obj', obj);
  // 切换场景
  scene.value = obj.sceneNum
  // 判断是添加还是修改
  if (obj.addOrUpdate === 'update') {
    // 修改SPU则留在当前页码不变
    getHasSpuList(currentPage.value)
  } else {
    // 添加SPU则返回第一页
    getHasSpuList()
  }
}

// 查看SKU列表
const showSkuList = async (row: SPUData) => {
  console.log('row', row)
  let res: SkuListResponseData = await reqGetSkuList(row.id)
  console.log(res)
  if (res.code === 200) {
    skuList.value = res.data
  }
  // 打开对话框
  dialogVisible.value = true
}

// 删除SPU
const deleteSpu = async (row: SPUData) => {
  let res: any = await reqDeleteSpu(row.id)
  console.log(res)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 不能单纯获取SPU列表。如果SPU列表长度大于1，则停留在当前页码，否则停留在上一页
    getHasSpuList(
      hasSpuList.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 组件卸载前挂载，要清空仓库数据，否则切换路由时，再切换回来时，数据还存在
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
