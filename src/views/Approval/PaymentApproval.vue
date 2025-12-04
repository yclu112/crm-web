<template>
  <div class="table-box">
    <!-- 回款列表 ProTable -->
    <ProTable
      ref="proTable"
      title="回款列表"
      :columns="columns"
      :requestApi="PaymentApi.page"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
      bordered
      pagination
    >
      <!-- 操作列：审核通过/不通过按钮 -->
      <template #operation="scope">
        <el-button
          type="success"
          link
          :icon="CircleCheckFilled"
          v-if="scope.row.status === PaymentStatusEnum.WAIT"
          v-hasPermi="['sys:payment:pass']"
          @click="openApprovalDialog(scope.row, ApprovalTypeEnum.PASS)"
        >
          审核通过
        </el-button>
        <el-button
          type="danger"
          link
          :icon="CircleCloseFilled"
          v-if="scope.row.status === PaymentStatusEnum.WAIT"
          v-hasPermi="['sys:payment:reject']"
          @click="openApprovalDialog(scope.row, ApprovalTypeEnum.REJECT)"
        >
          审核不通过
        </el-button>
      </template>
    </ProTable>

    <!-- 审核弹窗 -->
    <PaymentDialog v-model="dialogVisible" :approval-type="currentApprovalType" :contract="contractDetail" :payment-record="selectedPaymentRecord" @submit="handleDialogSubmit" />
  </div>
</template>

<script setup lang="ts" name="PaymentManage">
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { ref, h } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { PaymentApi } from '@/api/modules/payment'
import { ContractApi } from '@/api/modules/contract'
import { PaymentStatusList, PaymentMethodList, ApprovalTypeEnum, PaymentStatusEnum, PaymentStatusTextEnum, PaymentStatusTypeEnum } from '@/configs/enum'
import { ElMessage } from 'element-plus'
import PaymentDialog from './components/PaymentDialog.vue'

// ProTable 实例引用
const proTable = ref<any>(null)

// 响应式状态
const dialogVisible = ref(false)
const currentApprovalType = ref<ApprovalTypeEnum>(ApprovalTypeEnum.PASS)
const selectedPaymentRecord = ref<any>(null)
const contractDetail = ref<any>(null)

/**
 * 数据回调函数：适配 ProTable 格式
 */
const dataCallback = (data: any) => {
  const sortedList = data.list?.sort((a: any, b: any) => Number(a.id) - Number(b.id)) || []
  return {
    list: sortedList,
    total: data.total || 0
  }
}

/**
 * 表格列配置
 */
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  { prop: 'contractNumber', label: '合同编号', minWidth: 150, search: { el: 'input' } },
  { prop: 'contractName', label: '合同名称', minWidth: 200, search: { el: 'input' } },
  {
    prop: 'amount',
    label: '回款金额',
    minWidth: 120,
    formatter: (row: any) => formatCurrency(row.amount)
  },
  {
    prop: 'paymentMethod',
    label: '支付方式',
    minWidth: 120,
    enum: Object.values(PaymentMethodList),
    search: { el: 'select', options: Object.values(PaymentMethodList) }
  },
  { prop: 'paymentTime', label: '支付时间', minWidth: 180 },
  {
    prop: 'status',
    label: '审核状态',
    minWidth: 120,
    enum: Object.values(PaymentStatusList),
    search: { el: 'select', options: Object.values(PaymentStatusList) },
    formatter: (row: any) => {
      const status = row.status
      return h('el-tag', { type: PaymentStatusTypeEnum[status] }, () => PaymentStatusTextEnum[status])
    }
  },
  { prop: 'createTime', label: '创建时间', minWidth: 180 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 220 }
]

/**
 * 辅助函数：格式化金额
 */
const formatCurrency = (value?: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num !== undefined && num !== null && !isNaN(num) ? `${num.toFixed(2)} 元` : '0.00 元'
}

/**
 * 打开审核弹窗
 */
const openApprovalDialog = async (row: any, type: ApprovalTypeEnum) => {
  currentApprovalType.value = type
  selectedPaymentRecord.value = row
  dialogVisible.value = false

  try {
    const response = await ContractApi.getById(row.contractId)
    contractDetail.value = {
      number: response.data.number || '',
      name: response.data.name || '',
      receivedAmount: response.data.receivedAmount || 0
    }
  } catch (error) {
    console.error('获取合同信息失败:', error)
    ElMessage.error('获取合同信息失败')
    contractDetail.value = {
      number: row.contractNumber || '',
      name: row.contractName || '',
      receivedAmount: 0
    }
  }

  dialogVisible.value = true
}
/**
 * 处理弹窗提交事件（彻底弃用 useHandleData，自己调用 API）
 */
const handleDialogSubmit = async (submitData: any) => {
  try {
    // 1. 直接调用回款审核 API（不通过 useHandleData）
    await PaymentApi.approvalPayment(submitData)

    // 2. 合并提示文案（只弹一次）
    const successMsg = submitData.type === 0 ? '回款审核通过，合同已付金额已更新' : '回款审核不通过，合同已付金额已同步调整'
    ElMessage.success(successMsg)

    // 3. 关闭弹窗 + 刷新列表
    dialogVisible.value = false
    proTable.value.getTableList()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}
</script>

<style scoped>
.table-box {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 120px);
}
</style>
