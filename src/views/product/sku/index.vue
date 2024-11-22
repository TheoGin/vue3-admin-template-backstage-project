<template>
  <el-card>
    <!-- 表格组件 border：边框 -->
    <el-table border style="margin: 10px 0" :data="skuList">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="80"
      ></el-table-column>
      <el-table-column
        label="名称"
        width="200"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        width="200"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="默认图片" width="200">
        <template #default="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt="图片"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="重量" width="200" prop="weight"></el-table-column>
      <el-table-column label="价格" width="200" prop="price"></el-table-column>
      <el-table-column label="操作" width="360" fixed="right">
        <template #default="{ row, $index }">
          <el-button
            :type="row.isSale === 1 ? 'info' : 'success'"
            size="small"
            :icon="row.isSale === 1 ? 'Bottom' : 'Top'"
            @click="skuOnAndCancelSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="handleEditSKU"
          ></el-button>
          <el-button
            type="info"
            size="small"
            icon="InfoFilled"
            @click="lookSkuInfo(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定要删除${row.skuName}吗？`"
            @confirm="deleteSku(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasSkuList"
      @size-change="handleSizeChange"
    />
    <!-- 抽屉 -->
    <el-drawer v-model="drawerVisible" direction="rtl">
      <template #header>
        <h4>查看商品SKU详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0">
          <el-col :span="6">SKU名称</el-col>
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
              style="margin: 5px"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
              style="margin: 5px"
            >
              {{ item.saleAttrName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  alt="图片"
                  style="width: 100px; height: 100px"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqGetSkuList,
  reqOnSaleSku,
  reqCancelSaleSku,
  reqGetSkuInfo,
  reqDeleteSku,
} from '@/api/product/sku'
import type {
  SkuListResponseData,
  SkuData,
  SkuInfoResponseData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

// 当前页
const currentPage = ref<number>(1)
// 每页条数
const pageSize = ref<number>(10)
// SKU列表
const skuList = ref<SkuData[]>([])
// 总条数
const total = ref<number>(0)
// 抽屉是否显示
const drawerVisible = ref<boolean>(false)
// SKU商品信息
const skuInfo = ref<SkuData>({})

// 获取SKU列表。pager不传默认为1
const getHasSkuList = async (pager = 1) => {
  currentPage.value = pager
  // console.log(reqGetSkuList);
  // 调用接口获取SKU列表
  const res: SkuListResponseData = await reqGetSkuList(
    currentPage.value,
    pageSize.value,
  )
  // console.log(res);
  skuList.value = res.data.records
  total.value = res.data.total
}

// 挂载后获取SKU列表
onMounted(() => {
  getHasSkuList()
})

// // 当前页改变时获取SKU列表。pager为当前点击页码
// const handleCurrentChange = (pager: number) => {
//   currentPage.value = pager
//   getHasSkuList(pager)
// }

// 每页条数改变时获取SKU列表。size为当前每页条数
const handleSizeChange = (size: number) => {
  // console.log(size);
  // 修改每页条数
  pageSize.value = size
  // 获取SKU列表
  getHasSkuList(size)
}

// 上架和下架SKU
const skuOnAndCancelSale = async (row: SkuData) => {
  console.log(row)
  if (row.isSale === 1) {
    // 下架
    await reqCancelSaleSku(row.id)
    // 提示信息
    ElMessage.warning('下架成功')
    // 重新获取SKU列表
    getHasSkuList()
  } else {
    // 上架
    await reqOnSaleSku(row.id)
    // 提示信息
    ElMessage.success('上架成功')
    // 重新获取SKU列表
    getHasSkuList()
  }
}

// 编辑SKU
const handleEditSKU = () => {
  ElMessage.success('程序员正在努力开发中……')
}

// 查看SKU详情
const lookSkuInfo = async (row: SkuData) => {
  console.log(row)
  // 打开抽屉
  drawerVisible.value = true
  // 调用接口获取SKU商品信息
  const res: SkuInfoResponseData = await reqGetSkuInfo(row.id)
  console.log(res)
  if (res.code === 200) {
    // 保存SKU商品信息
    skuInfo.value = res.data
  }
}

// 删除SKU
const deleteSku = async (skuId: number | string) => {
  const res: any = await reqDeleteSku(skuId)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getHasSkuList(
      skuList.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
