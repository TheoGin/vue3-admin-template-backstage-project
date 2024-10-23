<template>
  <div>
    <!-- 顶部分类 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-if="scene == 0 ? true : false">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加平台属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button
                size="small"
                type="warning"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.attrName}?`"
                icon="Delete"
                width="249px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    type="danger"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="scene == 1 ? true : false">
        <el-form>
          <el-form-item label="属性名称：">
            <el-input
              v-model="attrFormParams.attrName"
              style="width: 200px"
              placeholder="请输入属性的名字"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="Plus"
          :disabled="attrFormParams.attrName ? false : true"
          @click="handleAddAttrValue"
        >
          添加属性“值”
        </el-button>
        <el-button type="default" @click="cancel">取消</el-button>
        <el-table
          border
          style="margin: 10px 0"
          :data="attrFormParams.attrValueList"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="属性值">
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputRefArr[$index] = vc)"
                v-if="row.isInput === true ? true : false"
                @blur="handleValueNameInputBlur(row, $index)"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="handleToInput(row, $index)">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="danger"
                icon="Delete"
                @click="attrFormParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="handleSave"
          :disabled="attrFormParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/module/category'
import { nextTick, reactive, ref, watch } from 'vue'
import { reqAttrByCategoryId, reqDeleteAttr } from '@/api/product/attr'
// import axios from 'axios';
import type { AttrResponceData, AttrValue } from '@/api/product/attr/types'
import { reqAddOrUpdateAttr } from '@/api/product/attr'
import { ElMessage } from 'element-plus'
import type { Attr } from '@/api/product/attr/types'
import { onBeforeUnmount } from 'vue'

const categoryStore = useCategoryStore()
let attrArr = ref<Attr[]>([])
let scene = ref<number>(0)
// 收集新增属性的数据
let attrFormParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [
    //新增的属性值数组
    // {
    //   valueName: ''
    // }
  ],
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //代表的是三级分类
})

const inputRefArr = ref<any>([])

const getAttrArr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  const res: AttrResponceData = await reqAttrByCategoryId(c1Id, c2Id, c3Id)
  // console.log(res.data);
  attrArr.value = res.data
}

watch(
  () => categoryStore.c3Id,
  () => {
    // categoryStore.c3Id为空时，表格不应该有数据
    attrArr.value = []

    // 监测到categoryStore.c3Id变化，但是为空，不发送网络请求
    if (!categoryStore.c3Id) return
    getAttrArr()
  },
)

const addAttr = () => {
  Object.assign(attrFormParams, {
    attrName: '', //新增的属性的名字
    attrValueList: [
      //新增的属性值数组
      // {
      //   valueName: ''
      // }
    ],
    categoryId: categoryStore.c3Id, //三级分类的ID
    categoryLevel: 3, //代表的是三级分类
  })

  // 一点添加就有三级分类id了
  // attrFormParams.categoryId =categoryStore.c3Id;

  scene.value = 1
}
const updateAttr = (row: Attr) => {
  scene.value = 1

  // 编辑的取消会出现浅拷贝问题，需要用深拷贝解决
  // Object.assign(attrFormParams, row)
  Object.assign(attrFormParams, JSON.parse(JSON.stringify(row)))
}
const cancel = () => {
  scene.value = 0
}

const handleAddAttrValue = () => {
  attrFormParams.attrValueList.push({ valueName: '', isInput: true })

  // 一点击不能马上拿到元素，所以要用nextTick。否则会Cannot read properties of undefined (reading 'focus')
  nextTick(() => {
    //获取最后el-input组件聚焦
    // console.log(inputRefArr.value[attrFormParams.attrValueList.length - 1]);
    inputRefArr.value[attrFormParams.attrValueList.length - 1].focus()
  })
}

const handleSave = async () => {
  const res = await reqAddOrUpdateAttr(attrFormParams)
  // console.log(res);
  if (res.code === 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrFormParams.id ? '修改成功' : '添加成功',
    })
    getAttrArr()
  } else {
    ElMessage({
      type: 'error',
      message: attrFormParams.id ? '修改失败' : '添加失败',
    })
  }
}
// 失去焦点后
const handleValueNameInputBlur = (row: AttrValue, $index: number) => {
  // 非法情况1
  if (row.valueName.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    attrFormParams.attrValueList.splice($index, 1)
    return
  }
  // 非法情况2
  let repeatValueName = attrFormParams.attrValueList.find((item: AttrValue) => {
    //切记把当前失却焦点属性值对象从当前数组扣除判断
    if (item !== row) {
      return item.valueName === row.valueName
    }
  })
  // console.log(repeatValueName);
  if (repeatValueName) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    attrFormParams.attrValueList.splice($index, 1)
    return
  }

  //相应的属性值对象isInput:变为false,展示div
  row.isInput = false
}
// 处理变回输入
const handleToInput = (row: AttrValue, $index: number) => {
  row.isInput = true

  // nextTick要放在row.isInput = true;不然没有input，就拿不到ref！！！
  // console.log(inputRefArr.value[$index]); // null
  nextTick(() => {
    // console.log(inputRefArr.value[$index]);
    inputRefArr.value[$index].focus()
  })
}
// :ref="handleRef" 当模板的结构发生变化就会触发 【<el-input :ref="handleRef" v-if="row.isInput === true ? true : false" @blur="handleValueNameInputBlur(row, $index)" v-model="row.valueName"></el-input>】
// const handleRef = (ele: any) => {
//   console.log(ele); // ele为当前元素
// }

const deleteAttr = async (attrId: number | string) => {
  const res = await reqDeleteAttr(attrId)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAttrArr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
