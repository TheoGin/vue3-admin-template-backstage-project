<template>
  <div>
    <el-card style="width: 100%;">
      <!-- 顶部添加品牌按钮 -->
      <el-button type="primary" icon="Plus" @click="addTrademark">添加品牌</el-button>
      <!-- 表格数据区域 -->
      <!-- 
          el-table
              border	是否带有纵向边框	:::	boolean
      -->
      <el-table border style="margin: 10px 0;" :data="trademarkArr">
        <!-- 
          el-table-column
              label	显示的标题	    string            —
              align	对齐方式	      enum              left
              width	对应列的宽度	  string / number
              type	对应列的类型。 如果设置了selection则显示多选框； 如果设置了 index 则显示该行的索引（从 1 开始计算）； 如果设置了 expand 则显示为一个可展开的按钮	
      -->
        <el-table-column label="序号" align="center" width="80" type="index"></el-table-column>
        <el-table-column label="品牌名称" align="center" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO" align="center">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" align="center">
          <template #="{ row, $index }">
            <el-button type="warning" icon="Edit" @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`你确定要删除${row.tmName}?`" icon="Delete" width="249px" @confirm="handleTrademarkDel(row.id)">
              <template #reference>
                <el-button type="danger" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页器 -->
      <!-- 分页器组件
          pagination
              v-model:current-page:设置分页器当前页码
              v-model:page-size:设置每一个展示数据条数
              page-sizes:用于设置下拉菜单数据
              background:设置分页器按钮的背景颜色
              layout:可以设置分页器六个子组件布局调整
              page-count	总页数， total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持page-sizes 的更改，则需要使用 total 属性 number
      -->
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9, 11]"
        :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
        @current-change="getTrademarkArr" @size-change="handleSizeChange" :page-count="pageCount" />
    </el-card>
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="trademarkFormRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" style="width: 178px; height: 178px;"
              class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type UploadProps } from 'element-plus'
import { onMounted, reactive, ref } from "vue";
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from "@/api/product/trademark";
import type { TrademarkResponceData, Records, Trademark } from "@/api/product/trademark/type";
import { nextTick } from 'vue';
let currentPage = ref<number>(1);
let pageSize = ref<number>(3);
let total = ref<number>(0);
let pageCount = ref<number>(9);

let trademarkArr = ref<Records>([]);
// 对话框显示还是隐藏
let dialogFormVisible = ref<boolean>(false);
// 收集新增表单数据
let trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: ''
})

let trademarkFormRef = ref()

const getTrademarkArr = async (pager = 1) => {
  currentPage.value = pager;
  let res: TrademarkResponceData = await reqHasTrademark(currentPage.value, pageSize.value)
  // console.log(res);
  total.value = res.data.total;
  trademarkArr.value = res.data.records;
  pageCount.value = Math.ceil(total.value / pageSize.value);
  if (pageCount.value > 9) {
    pageCount.value = 9;
  }
}

onMounted(() => {
  getTrademarkArr()
})

//分页器当前页码发生变化的时候会触发
//对于当前页码发生变化自定义事件,组件pagination父组件回传了数据(当前的页码)
// const handleCurrentChange = ()=>{
//     //当前页码发生变化的时候再次发请求获取对应已有品牌数据展示
//     getHasTrademark();
// }

//当下拉菜单发生变化的时候触发次方法
//这个自定义事件,分页器组件会将下拉菜单选中数据返回
const handleSizeChange = () => {
  // currentPage.value = 1; 
  //当前每一页的数据量发生变化的时候，当前页码归1
  getTrademarkArr()
}


const addTrademark = () => {
  // 对话框显示
  dialogFormVisible.value = true
  // 添加品牌前先清空表达
  trademarkParams.id = 0;
  trademarkParams.tmName = '';
  trademarkParams.logoUrl = '';

  // 一开始没有el-form组件，访问trademarkFormRef.value就会undefined
  // console.log(trademarkFormRef.value);

  // 第一种解决方法，使用ts的问号解决
  // trademarkFormRef.value?.clearValidate('tmName');
  // trademarkFormRef.value?.clearValidate('logoUrl');

  // 第二种解决方法，用nextTick，会在el-form元素有了之后再访问trademarkFormRef.value
  nextTick(() => {
    trademarkFormRef.value.clearValidate('tmName');
    trademarkFormRef.value.clearValidate('logoUrl');
  })

}

// row：表示当前已有的一个品牌数据对象
const updateTrademark = (row: Trademark) => {
  nextTick(() => {
    trademarkFormRef.value.clearValidate('tmName');
    trademarkFormRef.value.clearValidate('logoUrl');
  })

  // console.log(row);
  // id是作为修改品牌的标识
  // trademarkParams.id = row.id;
  // trademarkParams.tmName = row.tmName;
  // trademarkParams.logoUrl = row.logoUrl;
  // 一行代码代替以上几行代码
  Object.assign(trademarkParams, row)

  // 对话框显示
  dialogFormVisible.value = true

}


// 自定义校验品牌名称
const validatorTmName = (rule: any, value: any, callback: any) => {
  // console.log(rule);
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称长度需要大于等于2'))
  }
}

// 自定义校验品牌logo
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback();
  } else {
    callback(new Error('品牌logo务必上传'))
  }
}
const rules = {
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, trigger: 'change', validator: validatorLogoUrl }
  ]
}

const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false;
}
const confirm = async () => {
  // 发送请求之前进行校验。validate对整个表单的内容进行验证。 接收一个回调函数，或返回 Promise。加上await若为rejected，则不会执行后面的代码
  await trademarkFormRef.value.validate()


  let res: any = await reqAddOrUpdateTrademark(trademarkParams)
  console.log(res);
  if (res.code === 200) {
    // 对话框隐藏
    dialogFormVisible.value = false;
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
    })
    getTrademarkArr(trademarkParams.id ? currentPage.value : 1);
  } else {
    // 对话框隐藏
    dialogFormVisible.value = false;
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
    })
  }
}

// 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // console.log(rawFile);
  if (rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {

    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件大小必须小于4M'
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件格式必须为png | jpg | gif'
    })
    return false;
  }
}

// 文件上传成功时的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  // console.log(response, uploadFile);
  trademarkParams.logoUrl = response.data;
  // 	移除该表单项的校验结果
  trademarkFormRef.value.clearValidate('logoUrl')
}

const handleTrademarkDel = async (id: number) => {
  const res = await reqDeleteTrademark(id);
  // console.log(res);
  if(res.code ===200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getTrademarkArr(trademarkArr.value.length > 1? currentPage.value : currentPage.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
