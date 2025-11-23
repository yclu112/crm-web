<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="合同列表"
      :columns="columns"
      :requestApi="ContractApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="success" link :icon="CircleCheckFilled" v-hasPermi="['sys:contract:pass']" @click="openApprovalDialog(scope.row, 0)">审核通过</el-button>
        <el-button type="danger" link :icon="CircleCloseFilled" v-hasPermi="['sys:contract:reject']" @click="openApprovalDialog(scope.row, 1)">审核不通过</el-button>
      </template>
    </ProTable>
    <!-- 审核弹窗组件 -->
    <ApprovalDialog v-model="dialogVisible" :approval-type="currentApprovalType" :contract-id="currentContractId" @submit="handleApprovalSubmit" @close="dialogVisible = false" />
  </div>
</template>

<script setup lang="ts" name="ContractManager">
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue' // 新增拒绝图标
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { ContractApi } from '@/api/modules/contract'
import { ContractStatusList } from '@/configs/enum'
import { useHandleData } from '@/hooks/useHandleData'
import ApprovalDialog from './components/ApprovalDialog.vue'
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ status: 1 })
const dataCallback = (data: any) => {
  // 对列表按 id 升序排序（确保 id 为数字类型）
  const sortedList = data.list.sort((a: any, b: any) => {
    return Number(a.id) - Number(b.id)
  })
  return {
    list: sortedList, // 返回排序后的列表
    total: data.total
  }
}

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口

// 表格配置项
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '合同名称',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'number',
    label: '合同编号',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'customerName',
    label: '客户姓名',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'amount',
    label: '合同金额',
    minWidth: 100
  },
  {
    prop: 'receivedAmount',
    label: '已收到款项',
    minWidth: 140
  },
  {
    prop: 'status',
    label: '合同状态',
    minWidth: 120,
    enum: Object.values(ContractStatusList),
    search: { el: 'select' }
  },
  {
    prop: 'signTime',
    label: '签约时间',
    minWidth: 140
  },
  {
    prop: 'startTime',
    label: '合同开始时间',
    minWidth: 140
  },
  {
    prop: 'endTime',
    label: '合同结束时间',
    minWidth: 140
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]
// 合同审核
// const approvalContract = async (row: any, type: number) => {
//   await useHandleData(ContractApi.approvalContract, { id: row.id, type }, type === 0 ? '合同审核通过' : '合同审核不通过')
//   proTable.value.getTableList()
// }

// 弹窗相关状态(自增)
const dialogVisible = ref(false)
const currentApprovalType = ref(0) // 0=通过，1=拒绝
const currentContractId = ref(0)

// 打开审核弹窗(自增)
const openApprovalDialog = (row: any, type: number) => {
  currentContractId.value = row.id
  currentApprovalType.value = type
  dialogVisible.value = true
}

// 提交审核（带审核内容）(自增)
const handleApprovalSubmit = async (data: { id: number; type: number; comment: string }) => {
  await useHandleData(
    ContractApi.approvalContract,
    data, // 包含id、type、comment（审核内容）
    data.type === 0 ? '合同审核通过' : '合同审核不通过'
  )
  dialogVisible.value = false
  proTable.value.getTableList() // 刷新表格
}
</script>
