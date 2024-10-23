<template>
    <div>
        <el-form label-width="100px">
            <el-form-item label="SPU名称">
                <el-input placeholder="请输入SPU名称" v-model="spuFormData.spuName"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spuFormData.tmId">
                    <el-option v-for="item in trademarkList" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input type="textarea" :rows="4" placeholder="请输入SPU描述" v-model="spuFormData.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <el-upload
                    v-model:file-list="spuImageList"
                    action="/api/admin/product/fileUpload" 
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :before-upload="handleBeforeUpload"
                >
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-select :placeholder="unSelectSaleAttrList.length > 0 ? `还未选择${unSelectSaleAttrList.length}个销售属性` : '无'" style="width: 200px;" v-model="selectSaleAttrIdAndName">
                    <el-option v-for="item in unSelectSaleAttrList" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`"></el-option>
                </el-select>
                <el-button type="primary" icon="Plus" style="margin-left: 10px;" @click="addSaleAttr" :disabled="selectSaleAttrIdAndName ? false : true">添加销售属性</el-button>
                <el-table border style="margin: 10px 0" :data="spuSaleAttrList">
                    <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                    <el-table-column label="销售属性名称" prop="saleAttrName"  width="120px"></el-table-column>
                    <el-table-column label="销售属性值">
                        <template #="{row, $index}">
                            <el-tag closable @close="row.spuSaleAttrValueList.splice(index, 1)" v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" style="margin: 0 5px;">{{item.saleAttrValueName}}</el-tag>
                            <el-button v-if="!row.isInputOrButton" type="primary" icon="Plus" size="small" @click="addSaleAttrValueToInput(row)"></el-button>
                            <el-input v-else style="width: 50px;" size="small" v-model="row.saleAttrValueName" @blur="handleBlurToLook(row)" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #="{row, $index}">
                            <el-button type="danger" icon="Delete" @click="spuSaleAttrList.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="spuSaleAttrList?.length > 0 ? false : true" @click="addOrUpdateSpu">保存</el-button>
                <el-button type="default" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import type { SPUData } from '@/api/product/spu/type';
import { reqAllSaleAttrList, reqAllTrademarkList, reqSpuImageList, reqSpuSaleAttrList, reqAddOrUpdateSpu } from '@/api/product/spu';
import type { SaleAttr, Trademark, SpuImage, SaleAttrListResponseData, TradeMarkListResponseData, SpuImageListResponseData, SaleAttrValue } from '@/api/product/spu/type';
import { ref, computed } from 'vue';
import { ElMessage, type UploadFile, type UploadRawFile } from 'element-plus';

let emit = defineEmits(['changeScene']);
// 从接口收集全部的销售属性
let saleAttrList = ref<SaleAttr[]>([]);
// 从接口收集全部的品牌
let trademarkList = ref<Trademark[]>([]);
// 从接口收集SPU下已有的图片
let spuImageList = ref<SpuImage[]>([]);
// 从接口收集SPU下已有的销售属性
let spuSaleAttrList = ref<SaleAttr[]>([]);
// 收集SPU数据。需要给默认值为空，因为可能是新增SPU。如果是修改SPU，则没有id
let spuFormData = ref<SPUData>({
    category3Id: '',
    spuName: '',
    tmId: '',
    description: '',
    spuImageList: [],
    spuSaleAttrList: [],
});
// 预览图片的对话框是否显示
let dialogVisible = ref<boolean>(false);
// 预览图片的URL
let dialogImageUrl = ref<string>('');
// 选中的销售属性
let selectSaleAttrIdAndName = ref<string>('');
// 需要计算未选中的销售属性！！！
let unSelectSaleAttrList = computed(() => {
    return saleAttrList.value.filter((item: SaleAttr) => {
        return spuSaleAttrList.value?.every((item2: SaleAttr) => item.name !== item2.saleAttrName)
    });
});


// 取消按钮
const cancel = () => {
    // console.log('cancel');
    emit('changeScene', {sceneNum: 0, addOrUpdate: 'update'});
}
// 初始化已有的SPU数据
const initHasSpuData = async (spu: SPUData) => {
    // console.log('spu', spu);
    // 获取全部的品牌
    const resAllTrademarkList: TradeMarkListResponseData = await reqAllTrademarkList();
    trademarkList.value = resAllTrademarkList.data;
    // console.log('trademarkList.value', trademarkList.value);
    // 获取某一个SPU下的全部商品图片数据
    const resSpuImageList: SpuImageListResponseData = await reqSpuImageList(spu.id);
    spuImageList.value = resSpuImageList.data?.map((item: SpuImage) => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    });
    // console.log('spuImageList.value', spuImageList.value);
    // 获取全部的销售属性
    const resAllSaleAttrList: SaleAttrListResponseData = await reqAllSaleAttrList();
    saleAttrList.value = resAllSaleAttrList.data;
    // console.log('saleAttrList.value', saleAttrList.value);
    // 获取某一个SPU下已有的销售属性
    const resSpuSaleAttrList: SaleAttrListResponseData = await reqSpuSaleAttrList(spu.id);
    spuSaleAttrList.value = resSpuSaleAttrList.data;
    // console.log('spuSaleAttrList.value', spuSaleAttrList.value);

    // 将获取到的数据赋值给spuFormData
    spuFormData.value = spu;
}
// 上传图片之前
const handleBeforeUpload = (file: UploadRawFile) => {
    // console.log('file', file);
    if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
        if(file.size / 1024 / 1024 < 5) {
            // 图片大小合法
            ElMessage({
                type: 'success',
                message: '上传成功！'
            });
            return true;
        }else {
            ElMessage({
                type: 'error',
                message: '上传的图片大小务必小于5M！'
            });
            return false;
        }
    }else {
        ElMessage({
            type: 'error',
            message: '上传的图片格式务必为.jpg| .png | .gif格式！'
        });
        return false;
    }
}
// 预览图片
const handlePictureCardPreview = (file: UploadFile) => {
    // 使用了非空断言操作符（!），告诉 TypeScript 编译器 file.url 一定不会是 undefined
    dialogImageUrl.value = file.url!;
    dialogVisible.value = true;
}
// 删除图片
const handleRemove = (file: UploadFile) => {
    console.log('file', file);
}

// 添加销售属性
const addSaleAttr = () => {
    // console.log('addSaleAttr');
    // 解构selectSaleAttrIdAndName
    let [saleAttrId, saleAttrName] = selectSaleAttrIdAndName.value.split(':');
    // console.log('saleAttrId', saleAttrId);
    // console.log('saleAttrName', saleAttrName);
    // 创建一个新的销售属性对象
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId: saleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
    }
    // 将新的销售属性对象添加到spuSaleAttrList中
    spuSaleAttrList.value.push(newSaleAttr);

    // 清空selectSaleAttrIdAndName
    selectSaleAttrIdAndName.value = '';
}

// 添加销售属性值
const addSaleAttrValueToInput = (row: SaleAttr) => {
    // 清空输入框
    row.saleAttrValueName = '';
    // 将isInputOrButton设置为true，展示输入框
    row.isInputOrButton = true;
    // 自动聚焦

}
// 失去焦点
const handleBlurToLook = (row: SaleAttr) => {
    console.log('row', row);
    // 从row对象中解构出baseSaleAttrId和saleAttrValueName
    let {baseSaleAttrId, saleAttrValueName} = row;

    // 创建一个新的销售属性值对象
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName,
    }

    // 非法情况：销售属性值不能为空
    // if(saleAttrValueName === '' || saleAttrValueName?.trim() === '') {
    if((saleAttrValueName as string).trim() === '') {
        ElMessage({
            type: 'error',
            message: '销售属性值不能为空！'
        });
        // row.isInputOrButton = false;
        return;
    }
    // 非法情况：销售属性值不能重复
    let repeat = row.spuSaleAttrValueList.find((item: SaleAttrValue) => item.saleAttrValueName === saleAttrValueName);
    // console.log('repeat', repeat);
    if(repeat) {
        ElMessage({
            type: 'error',
            message: '销售属性值不能重复！'
        });
        return;
    }

    // 将新的销售属性值对象添加到row的saleAttrValueList中
    row.spuSaleAttrValueList.push(newSaleAttrValue);

    // 失去焦点后，将isInputOrButton设置为false，展示按钮
    row.isInputOrButton = false;
}

// 保存SPU
const addOrUpdateSpu = async () => {
    // 整理spuFormData数据
    // 整理图片数据
    spuFormData.value.spuImageList = spuImageList.value.map((item: UploadFile) => {
        // console.log('item', item);
        return {
            imgName: item.name,
            // 如果item.response存在，则使用item.response中的数据，否则使用item.url
            imgUrl: (item.response && (item.response as any)?.data) || item.url
        }
    })
    // console.log('spuFormData.value.spuImageList', spuFormData.value.spuImageList);

    // 整理销售属性数据
    spuFormData.value.spuSaleAttrList = spuSaleAttrList.value;
    // 发起请求
    const res = await reqAddOrUpdateSpu(spuFormData.value);
    // console.log('res', res);
    if(res.code === 200) {
        ElMessage({
            type: 'success',
            message: spuFormData.value.id ? '修改SPU成功！' : '添加SPU成功！'
        });
        // 关闭对话框
        dialogVisible.value = false;
        // 通知父组件
        emit('changeScene', {sceneNum: 0, addOrUpdate: spuFormData.value.id ? 'update' : 'add'});
    }else {
        ElMessage({
            type: 'error',
            message: spuFormData.value.id ? '修改SPU失败！' : '添加SPU失败！'
        });
    }
}
// 初始化SKU数据
const initAddSkuData = async (category3Id: number | string) => {
    // 初始化SPU数据
    Object.assign(spuFormData.value, {
        category3Id,
        spuName: '',
        tmId: '',
        description: '',
        spuImageList: [],
        spuSaleAttrList: [],
    });
    // 清空图片列表
    spuImageList.value = [];
    // 清空销售属性列表
    spuSaleAttrList.value = [];
    // 清空已选择销售属性
    selectSaleAttrIdAndName.value = '';

    // 获取全部的品牌
    const resAllTrademarkList: TradeMarkListResponseData = await reqAllTrademarkList();
    trademarkList.value = resAllTrademarkList.data;
    // 获取全部的销售属性
    const resAllSaleAttrList: SaleAttrListResponseData = await reqAllSaleAttrList();
    saleAttrList.value = resAllSaleAttrList.data;
}

// 使用defineExpose将组件中的数据交给外部，外部可通过ref获取组件中的数据或方法
defineExpose({
    initHasSpuData,
    initAddSkuData
})

</script>
<style scoped></style>