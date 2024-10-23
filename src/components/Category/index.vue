<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryStore.c1Id"
          style="width: 240px"
          @change="handleC1SelectChange"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="(c1, index) in categoryStore.category1Arr"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          style="width: 240px"
          v-model="categoryStore.c2Id"
          @change="handleC2SelectChange"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="(c2, index) in categoryStore.category2Arr"
            :label="c2.name"
            :key="c2.id"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select style="width: 240px" v-model="categoryStore.c3Id"  :disabled="scene == 0 ? false : true">
          <el-option
            v-for="(c3, index) in categoryStore.category3Arr"
            :label="c3.name"
            :key="c3.id"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategorySotre from '@/store/module/category'

defineProps(['scene'])

const categoryStore = useCategorySotre()

onMounted(() => {
  getC1()
})

const getC1 = () => {
  categoryStore.getC1()
}

const handleC1SelectChange = () => {
  categoryStore.c2Id = ''
  categoryStore.category3Arr = []
  categoryStore.c3Id = ''

  categoryStore.getC2()
}

const handleC2SelectChange = () => {
  categoryStore.c3Id = ''

  categoryStore.getC3()
}
</script>

<style scoped></style>
