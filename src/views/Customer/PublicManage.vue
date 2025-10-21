<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="公海管理"
      :columns="columns"
      :requestApi="CustomerApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" v-hasPermi="['sys:customer:private']" @click="customerToPrivate(scope.row.id)">客户领取</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="PublicManage">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { CustomerApi } from '@/api/modules/customer'
import { GenderList, IsKeyDecisionMakerList } from '@/configs/enum'
import { EditPen } from '@element-plus/icons-vue'
import { useHandleData } from '@/hooks/useHandleData'

// 获取 ProTable 元素，调用其获取刷新数据方法
const proTable = ref()

// 初始化请求参数 - 只查询公海客户
const initParam = reactive({ isPublic: 1 })
const dataSize = ref(0)

// 数据处理回调
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
  { prop: 'operation', label: '操作', fixed: 'right', width: 130 }
]

// 领取客户
const customerToPrivate = async (id: any) => {
  await useHandleData(CustomerApi.toPrivate, { id: id }, '领取客户')
  proTable.value.clearSelection()
  proTable.value.getTableList()
}
</script>
