<template>
  <div class="table-box1">
    <ProTable
      ref="proTable"
      title="客户列表"
      :columns="columns"
      :requestApi="CustomerApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" v-hasPermi="['sys:customer:add']" @click="openDrawer('新增')">新增客户</el-button>
        <el-button type="primary" :icon="Download" @click="downloadFile" v-hasPermi="['sys:customer:export']">导出客户</el-button>
        <el-button type="danger" :icon="Delete" :disabled="!scope.isSelected" v-hasPermi="['sys:customer:remove']" @click="batchDelete(scope.selectedListIds)">批量删除</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" v-hasPermi="['sys:customer:edit']" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" v-hasPermi="['sys:customer:remove']" @click="batchDelete([scope.row.id])">删除</el-button>
        <el-button type="warning" link :icon="Share" v-hasPermi="['sys:customer:share']" @click="customerToPublic(scope.row.id)">转入公海</el-button>
      </template>
    </ProTable>
    <CustomerDialog ref="dialogRef" />
  </div>
</template>
<script setup lang="ts" name="CustomerManage">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { CustomerApi } from '@/api/modules/customer'
import { CustomerLevelList, CustomerSourceList, FollowUpStatusList, GenderList, IsKeyDecisionMakerList } from '@/configs/enum'
import { CirclePlus, EditPen, Delete, Share } from '@element-plus/icons-vue'
import CustomerDialog from './components/CustomerDialog.vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useDownload } from '@/hooks/useDownload'
import { useHandleData } from '@/hooks/useHandleData'

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ isPublic: 0 })
const dataSize = ref(0)

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  dataSize.value = data.list.size
  return {
    list: data.list,
    total: data.total
  }
}

// 表格配置项
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '客户名称',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'phone',
    label: '手机号',
    minWidth: 160,
    search: { el: 'input' }
  },
  {
    prop: 'email',
    label: '邮箱',
    minWidth: 120
  },
  {
    prop: 'gender',
    label: '性别',
    enum: Object.values(GenderList),
    minWidth: 120
  },
  {
    prop: 'isKeyDecisionMaker',
    label: '是否为关键决策人',
    enum: Object.values(IsKeyDecisionMakerList),
    minWidth: 140
  },
  {
    prop: 'dealCount',
    label: '成交次数',
    minWidth: 120
  },
  {
    prop: 'level',
    label: '客户级别',
    enum: Object.values(CustomerLevelList),
    minWidth: 120,
    search: { el: 'select' }
  },
  {
    prop: 'source',
    label: '客户来源',
    enum: Object.values(CustomerSourceList),
    minWidth: 120,
    search: { el: 'select' }
  },
  {
    prop: 'address',
    label: '客户地址',
    minWidth: 180
  },
  {
    prop: 'followStatus',
    label: '跟进状态',
    enum: Object.values(FollowUpStatusList),
    minWidth: 120
  },
  {
    prop: 'nextFollowStatus',
    label: '下次跟进时间',
    minWidth: 200
  },
  {
    prop: 'createrName',
    label: '创建人',
    minWidth: 120
  },
  {
    prop: 'ownerName',
    label: '客户所属员工名称',
    minWidth: 140
  },
  {
    prop: 'remark',
    label: '备注',
    minWidth: 200
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 200
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

// 打开 drawer(新增、查看、编辑)
const dialogRef = ref()
const openDrawer = (title: string, row: Partial<any> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: CustomerApi.saveOrEdit,
    getTableList: proTable.value.getTableList,
    maxHeight: '300px'
  }
  dialogRef.value.acceptParams(params)
}

// 删除部门
// const deleteCustomer = async (params: any) => {
//   await useHandleData(CustomerApi.remove, { id: params.id }, `删除【${params.name}】`)
//   proTable.value.getTableList()
// }

const downloadFile = async () => {
  if (initParam) {
    proTable.value.searchParam.isPublic = initParam.isPublic
  }
  ElMessageBox.confirm('确认导出客户信息吗？', '温馨提示', { type: 'warning' }).then(() => useDownload(CustomerApi.export, '客户信息', proTable.value.searchParam))
}

const batchDelete = async (ids: any[]) => {
  await useHandleData(CustomerApi.remove, ids, '删除所选客户')
  proTable.value.clearSelection()
  proTable.value.getTableList()
}
const customerToPublic = async (id: any) => {
  await useHandleData(CustomerApi.toPublic, { id: id }, '转入公海')
  proTable.value.clearSelection()
  proTable.value.getTableList()
}
</script>
