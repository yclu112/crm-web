<template>
  <Dialog
    :model-value="dialogVisible"
    :title="dialogProps.title"
    :fullscreen="dialogProps.fullscreen"
    :max-height="dialogProps.maxHeight"
    :cancel-dialog="cancelDialog"
    width="75%"
    top="8vh"
  >
    <div :style="'width: calc(100% - ' + dialogProps.labelWidth! / 2 + 'px)'">
      <el-form
        ref="ruleFormRef"
        label-position="right"
        :label-width="dialogProps.labelWidth + 'px'"
        :rules="rules"
        :model="dialogProps.row"
        :disabled="dialogProps.isView"
        :hide-required-asterisk="dialogProps.isView"
      >
        <el-form-item label="合同编号" prop="number" v-if="dialogProps.row!.id">
          <el-input v-model="dialogProps.row!.number" readonly="true" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="name">
          <el-input v-model="dialogProps.row!.name" clearable maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="签约客户" prop="customerId">
          <div class="flex" style="width: 100%">
            <el-input v-model="dialogProps.row!.customerName" placeholder="请选择要签约的客户" class="mr-18px" disabled> </el-input>

            <el-button type="primary" @click="openCustomerDialog">客户信息</el-button>
            <CustomerDialog ref="customerRef" @get-customer-data="openCustomerDialog" />
          </div>
        </el-form-item>
        <div class="flex" style="width: 100%">
          <el-form-item label="合同开始时间" prop="startTime">
            <el-date-picker
              v-model="dialogProps.row!.startTime"
              type="date"
              placeholder="选择合同开始时间"
              value-format="YYYY-MM-DD"
              :disabled-date="(time) => time.getTime() < Date.now() - 8.64e7"
            />
          </el-form-item>
          <el-form-item label="合同结束时间" prop="endTime">
            <el-date-picker
              v-model="dialogProps.row!.endTime"
              type="date"
              placeholder="选择合同结束时间"
              value-format="YYYY-MM-DD"
              :disabled-date="(time) => time.getTime() < Date.now() - 8.64e7"
            />
          </el-form-item>
          <el-form-item label="合同签约时间" prop="signTime">
            <el-date-picker
              v-model="dialogProps.row!.signTime"
              type="date"
              placeholder="选择合同签约时间"
              value-format="YYYY-MM-DD"
              :disabled-date="(time) => time.getTime() < Date.now() - 8.64e7"
            />
          </el-form-item>
        </div>
        <div class="flex" style="width: 100%">
          <el-form-item label="合同总金额" prop="amount" style="flex: 1">
            <el-input v-model="dialogProps.row!.amount" clearable readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="已收款项" prop="receivedAmount" style="flex: 1">
            <el-input v-model="dialogProps.row!.receivedAmount" clearable readonly="true"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dialogProps.row!.remark" clearable type="textarea" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <div style="width: 100%">
          <h2>合同产品关系</h2>
          <el-divider />
          <el-table :data="dialogProps.row.products" border style="width: 100%">
            <el-table-column prop="pName" label="商品录入" min-width="140">
              <template #default="scope">
                <el-input v-model="scope.row.pName" placeholder="请输入商品" style="width: 180px" />
                <el-button type="primary" style="margin-left: 5px" @click="openProductDialog(scope.$index)">选择商品</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价"> </el-table-column>
            <el-table-column prop="count" label="数量">
              <template #default="scope">
                <el-input-number v-model="scope.row.count" :min="1" @change="calculateSubtotal(scope.row)" style="width: 100px" />
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="小计" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="danger" size="small" link @click="removeContractProduct(scope.$index)"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex; justify-content: center; width: 100%; margin-top: 10px">
            <el-button type="primary" @click="addContractProduct"> + 添加合同产品关系 </el-button>
          </div>
        </div>
      </el-form>
      <ProductDialog ref="productRef" @get-product-data="onProductSelect" />
    </div>
    <template #footer>
      <slot name="footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" v-show="!dialogProps.isView" @click="handleSubmit">确定</el-button>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import CustomerDialog from './CustomerDialog.vue'
import ProductDialog from './ProductDialog.vue'

interface DialogProps {
  title: string
  isView: boolean
  fullscreen?: boolean
  row: any
  labelWidth?: number
  maxHeight?: number | string
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  title: '',
  row: {
    products: []
  },
  labelWidth: 120,
  fullscreen: false,
  maxHeight: '500px'
})

// 接收父组件传过来的参数 - 修复版本
const acceptParams = (params: DialogProps): void => {
  // 确保 products 数组始终存在
  const rowData = {
    products: [], // 默认值
    ...params.row
  }

  // 如果传入的 row 没有 products，确保初始化为空数组
  if (!rowData.products) {
    rowData.products = []
  }

  dialogProps.value = {
    ...dialogProps.value,
    ...params,
    row: rowData
  }
  dialogVisible.value = true
}

defineExpose({
  acceptParams
})

// ✅ 自定义校验函数
const validateEndTime = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择合同结束时间'))
  } else if (dialogProps.value.row.startTime && new Date(value) < new Date(dialogProps.value.row.endTime)) {
    callback(new Error('合同结束时间不能早于开始时间'))
  } else {
    callback()
  }
}

const rules = reactive({
  name: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
  customerId: [{ required: true, message: '请选择客户', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择合同开始时间', trigger: 'blur' }],
  endTime: [
    { required: true, message: '请选择合同结束时间', trigger: 'blur' },
    {
      validator: validateEndTime,
      trigger: 'blur'
    }
  ],
  signTime: [{ required: true, message: '请选择合同签约时间', trigger: 'blur' }]
})

// 新增一行 - 修复版本
const addContractProduct = () => {
  // 确保 products 数组存在
  if (!dialogProps.value.row.products) {
    dialogProps.value.row.products = []
  }

  dialogProps.value.row.products.push({
    pName: '',
    pId: 0,
    price: 0,
    count: 1, // 默认数量改为1，避免计算时出现 NaN
    totalPrice: 0
  })
}

// 删除指定行 - 修复版本
const removeContractProduct = (index) => {
  if (dialogProps.value.row.products && dialogProps.value.row.products.length > index) {
    dialogProps.value.row.products.splice(index, 1)
    // 删除后重新计算总金额
    calculateTotalAmount()
  }
}

// 计算小计
const calculateSubtotal = (item) => {
  if (item && item.price !== undefined && item.count !== undefined) {
    item.totalPrice = item.price * item.count
    calculateTotalAmount()
  }
}

// 计算总金额
const calculateTotalAmount = () => {
  if (!dialogProps.value.row.products || dialogProps.value.row.products.length === 0) {
    dialogProps.value.row.amount = 0
    return
  }

  const total = dialogProps.value.row.products.reduce((total, product) => {
    return total + (product.totalPrice || 0)
  }, 0)

  dialogProps.value.row.amount = total
}

const ruleFormRef = ref<FormInstance>()

const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return

    // 验证产品数据
    if (!dialogProps.value.row.products || dialogProps.value.row.products.length === 0) {
      ElMessage.warning('请至少添加一个产品')
      return
    }

    // 验证每个产品是否已选择商品
    const invalidProducts = dialogProps.value.row.products.filter((product) => !product.pId || !product.pName)
    if (invalidProducts.length > 0) {
      ElMessage.warning('请为所有产品选择具体商品')
      return
    }

    try {
      const submitData = { ...dialogProps.value.row }
      delete submitData['updateTime']
      delete submitData['createTime']

      await dialogProps.value.api!(submitData)
      ElMessage.success({ message: `${dialogProps.value.title}成功！` })
      dialogProps.value.getTableList!()
      dialogVisible.value = false
      ruleFormRef.value!.resetFields()
      cancelDialog(true)
    } catch (error) {
      console.log(error)
      ElMessage.error(`${dialogProps.value.title}失败`)
    }
  })
}

const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  let condition = ['查看', '编辑']
  if (condition.includes(dialogProps.value.title) || isClean) {
    dialogProps.value.row = { products: [] } // 重置时也确保 products 存在
    ruleFormRef.value!.resetFields()
  }
}

// 打开客户列表
const customerRef = ref()
const openCustomerDialog = (val) => {
  let params = {
    title: '客户列表'
  }
  customerRef.value.acceptParams(params)
  if (val && val.id && val.name) {
    dialogProps.value.row.customerId = String(val.id)
    dialogProps.value.row.customerName = val.name
  }
}

// 打开商品列表
const productRef = ref()
const currentIndex = ref(0)
const openProductDialog = (index) => {
  currentIndex.value = index
  console.log('当前行索引：', index)
  let params = {
    title: '商品列表'
  }
  productRef.value.acceptParams(params)
}

// 子组件回调回来选中的商品 - 修复版本
const onProductSelect = (val) => {
  const index = currentIndex.value
  // 确保 products 数组和对应索引存在
  if (dialogProps.value.row.products && dialogProps.value.row.products[index] && val?.id && val?.name && val?.price) {
    dialogProps.value.row.products[index].pId = val.id
    dialogProps.value.row.products[index].pName = val.name
    dialogProps.value.row.products[index].price = val.price
    // 设置默认数量为1（如果当前数量为0）
    if (!dialogProps.value.row.products[index].count || dialogProps.value.row.products[index].count === 0) {
      dialogProps.value.row.products[index].count = 1
    }
    calculateSubtotal(dialogProps.value.row.products[index])
  }
}
</script>

<style scoped>
.flex {
  display: flex;
  gap: 16px;
}
.mr-18px {
  margin-right: 18px;
}
</style>
