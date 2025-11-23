<template>
  <!-- 改用内部 visible 状态控制弹窗显示，与 props 同步 -->
  <el-dialog v-model="innerVisible" :title="dialogTitle" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="审核原因" prop="comment">
        <el-input v-model="form.comment" type="textarea" :rows="4" placeholder="请输入审核通过/拒绝的具体原因" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch } from 'vue'
import { ElForm } from 'element-plus'

// 1. 接收父组件参数：使用 modelValue 作为 v-model 绑定的默认值（符合 Vue 规范）
const props = defineProps<{
  modelValue: boolean // 父组件 v-model 绑定的值（替代原 visible）
  approvalType: number
  contractId: number
}>()

// 2. 声明事件：支持 v-model 双向绑定（update:modelValue）
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void // 通知父组件更新显示状态
  (e: 'submit', data: { id: number; type: number; comment: string }): void
}>()

// 3. 内部维护弹窗显示状态，与 props.modelValue 同步
const innerVisible = ref(props.modelValue)
// 监听父组件传入的 modelValue 变化，同步到内部状态
watch(
  () => props.modelValue,
  (newVal) => {
    innerVisible.value = newVal
  }
)
// 监听内部状态变化，通知父组件更新 v-model
watch(innerVisible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 表单数据
const form = reactive({
  comment: ''
})

// 表单校验规则
const rules = {
  comment: [{ required: true, message: '请输入审核原因', trigger: 'blur' }]
}

const formRef = ref<InstanceType<typeof ElForm>>()

// 弹窗标题
const dialogTitle = props.approvalType === 2 ? '审核通过' : '审核不通过'

// 提交审核
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  // 传递审核数据给父组件
  emit('submit', {
    id: props.contractId,
    type: props.approvalType,
    comment: form.comment
  })
  // 提交后关闭弹窗（通过内部状态触发 update:modelValue）
  innerVisible.value = false
  // 重置表单
  form.comment = ''
  formRef.value.resetFields()
}

// 关闭弹窗（统一通过内部状态处理）
const handleClose = () => {
  innerVisible.value = false // 触发 update:modelValue 通知父组件
  form.comment = ''
  formRef.value?.resetFields()
}
</script>
