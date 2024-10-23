<template>
  <div class="skuform">
    <el-form label-width="100px" >
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称" v-model="skuFormData.skuName" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="请输入SKU价格" type="number" v-model="skuFormData.price" />
      </el-form-item>
      <el-form-item label="重量">
        <el-input placeholder="请输入SKU重量" type="number" v-model="skuFormData.weight" />
      </el-form-item>
      <el-form-item label="SKU描述">
        <el-input placeholder="请输入SKU描述" type="textarea" v-model="skuFormData.skuDesc" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form inline>
          <el-form-item v-for="attr in attrList" :label="attr.attrName" :key="attr.id">
            <!-- v-model="attr.attrIdAndValueId" 收集平台属性ID和平台属性值ID -->
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择" style="width: 200px; margin: 5px 0">
              <el-option v-for="attrValue in attr.attrValueList" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form inline>
          <el-form-item v-for="saleAttr in spuSaleAttrList" :label="saleAttr.saleAttrName" :key="saleAttr.id">
            <!-- v-model="saleAttr.saleAttrIdAndSaleAttrValueId" 收集销售属性ID和销售属性值ID -->
            <el-select v-model="saleAttr.saleAttrIdAndSaleAttrValueId" placeholder="请选择" style="width: 200px; margin: 5px 0">
              <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border :data="spuImageList" ref="tableRef">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="图片">
            <template #default="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px;">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="setDefaultImg(row)">设置默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveAddSku">保存</el-button>
        <el-button type="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { reqAttrByCategoryId } from '@/api/product/attr';
import type { SPUData } from '@/api/product/spu/type';
import type { Attr, AttrResponceData } from '@/api/product/attr/types';
import { reqSpuSaleAttrList, reqSpuImageList, reqAddSku } from '@/api/product/spu';
import type { SaleAttrListResponseData, SpuHasImgResponseData, SkuData } from '@/api/product/spu/type';
import type { SaleAttr, SpuImage } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';
const emit = defineEmits(['changeScene']);

// 平台属性列表
let attrList = ref<Attr[]>([]);
// 销售属性列表
let spuSaleAttrList = ref<SaleAttr[]>([]);
// 图片列表
let spuImageList = ref<SpuImage[]>([]);
// 收集SKU表单数据
let skuFormData = reactive<SkuData>({
  category3Id: '', // 三级分类ID
  spuId: '', // SPU的ID
  tmId: '', // 品牌ID
  skuName: '', // SKU名称
  price: '', // 价格
  weight: '', // 重量
  skuDesc: '', // SKU描述
  skuAttrValueList: [], // 平台属性值列表
  skuSaleAttrValueList: [], // 销售属性值列表
  skuDefaultImg: '', // SKU默认图片
});
// 表格DOM对象
let tableRef = ref<any>();

const cancel = () => {
  // console.log('cancecancell');
  emit('changeScene', { sceneNum: 0, addOrUpdate: 'cancel' });
};

// 初始化添加SKU数据
const initAddSkuData = async (c1Id: string, c2Id: string, spu: SPUData) => {
  // 收集数据
  skuFormData.category3Id = spu.category3Id;
  skuFormData.spuId = spu.id;
  skuFormData.tmId = spu.tmId;

  // console.log('c1Id', c1Id);
  // console.log('c2Id', c2Id);
  // console.log('spuId', spu);
  // 收集平台属性列表
  const resAttrList:AttrResponceData = await reqAttrByCategoryId(c1Id, c2Id, spu.category3Id)
  // console.log('resAttrList', resAttrList);
  attrList.value = resAttrList.data;
  // 销售属性列表
  const resSpuSaleAttrList:SaleAttrListResponseData = await reqSpuSaleAttrList(spu.id)
  // console.log('resSpuSaleAttrList', resSpuSaleAttrList);
  spuSaleAttrList.value = resSpuSaleAttrList.data;
  // 收集图片列表
  const resSpuImageList:SpuHasImgResponseData = await reqSpuImageList(spu.id)
  // console.log('resSpuImageList', resSpuImageList);
  spuImageList.value = resSpuImageList.data;
}   

// 设置默认图片
const setDefaultImg = (row: SpuImage) => {
  // // 第一种写法
  // // 点击图片，表格中所有图片被选中
  // // 先清空所有图片的选中状态
  // tableRef.value.clearSelection();
  // // 再选中当前图片
  // tableRef.value.toggleRowSelection(row);

  // 第二种写法
  // 点击图片，表格中所有图片被选中
  // 先清空所有图片的选中状态
  spuImageList.value.forEach((item: SpuImage) => {
    tableRef.value.toggleRowSelection(item, false);
  })
  // 再选中当前图片
  tableRef.value.toggleRowSelection(row, true);

  // 收集默认图片
  skuFormData.skuDefaultImg = row.imgUrl;
}

// 保存添加SKU
const saveAddSku = async () => {
  console.log('skuFormData', skuFormData);

  /* 注意是从attrList.value中遍历，而不是skuFormData.skuAttrValueList。
    使用reduce整理平台属性值列表。参数含义：
    prev: 上一次遍历的结果，next: 当前遍历的元素。
    初始值：[]
  */
  skuFormData.skuAttrValueList = attrList.value.reduce((prev: any, next: any) => {
    // 如果当前元素有attrIdAndValueId，则收集平台属性ID和平台属性值ID
    if (next.attrIdAndValueId) {
      // 解构出平台属性ID和平台属性值ID
      const [attrId, valueId] = next.attrIdAndValueId.split(':');
      // 收集平台属性ID和平台属性值ID
      prev.push({ attrId, valueId });
    }
    // 返回上一次遍历的结果。不return则返回undefined。因为reduce会比循环多遍历一次，最后一次返回undefined，如果不手动return，则最后一次返回undefined
    return prev;
  }, []);
  /* 注意是从spuSaleAttrList.value中遍历，而不是skuFormData.skuSaleAttrValueList。
    使用reduce整理销售属性值列表。参数含义：
    prev: 上一次遍历的结果，next: 当前遍历的元素。
    初始值：[]
  */
  skuFormData.skuSaleAttrValueList = spuSaleAttrList.value.reduce((prev: any, next: any) => {
    // 如果当前元素有saleAttrIdAndSaleAttrValueId，则收集销售属性ID和销售属性值ID
    if(next.saleAttrIdAndSaleAttrValueId) {
      // 解构出销售属性ID和销售属性值ID
      const [saleAttrId, saleAttrValueId] = next.saleAttrIdAndSaleAttrValueId.split(':');
      // 收集销售属性ID和销售属性值ID
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })
    }
    // 返回上一次遍历的结果。不return则返回undefined。因为reduce会比循环多遍历一次，最后一次返回undefined，如果不手动return，则最后一次返回undefined
    return prev;
  }, [])

  // 发请求
  const res = await reqAddSku(skuFormData);
  console.log('res', res);
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功'
    })
    // 关闭弹窗
    emit('changeScene', { sceneNum: 0, addOrUpdate: '' });
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败'
    })
  }
}

defineExpose({
  initAddSkuData
})
</script>
<style scoped>

</style>

