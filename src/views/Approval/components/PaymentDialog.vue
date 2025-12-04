<template>
  <el-dialog v-model="innerVisible" :title="dialogTitle" width="600px" @closed="handleClosed" destroy-on-close :before-close="handleBeforeClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px" class="mt-4">
      <!-- 基础信息（只读） -->
      <el-form-item label="合同编号">
        <el-input :value="contract?.number || '无'" disabled />
      </el-form-item>
      <el-form-item label="合同名称">
        <el-input :value="contract?.name || '无'" disabled />
      </el-form-item>
      <el-form-item label="应回款金额">
        <el-input :value="formatCurrency(paymentRecord?.amount)" disabled />
      </el-form-item>
      <el-form-item label="本次付款金额">
        <el-input :value="formatCurrency(unpaidAmount)" disabled />
      </el-form-item>

      <!-- 审核通过时的表单字段 -->
      <template v-if="approvalType === ApprovalTypeEnum.PASS">
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select v-model="form.paymentMethod" placeholder="请选择支付方式" style="width: 100%">
            <el-option v-for="method in paymentMethods" :key="method.value" :label="method.label" :value="method.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付时间" prop="paymentTime">
          <el-date-picker
            v-model="form.paymentTime"
            type="datetime"
            placeholder="选择支付时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledPastDate"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.comment" type="textarea" rows="3" maxlength="200" placeholder="可选备注信息" />
        </el-form-item>
      </template>

      <!-- 审核不通过时的表单字段 -->
      <template v-if="approvalType === ApprovalTypeEnum.REJECT">
        <el-form-item label="实际回款金额" prop="actualAmount">
          <el-input v-model.number="form.actualAmount" type="number" placeholder="请输入本次实际收到的金额" suffix="元" step="0.01" />
          <div class="form-hint">提示：金额需大于0且不超过应回款金额</div>
        </el-form-item>
        <el-form-item label="拒绝原因" prop="comment">
          <el-input v-model="form.comment" type="textarea" rows="3" maxlength="200" show-word-limit placeholder="请填写拒绝原因（审核不通过时必填）" />
        </el-form-item>
      </template>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :disabled="isSubmitDisabled" @click="handleSubmit">
        {{ approvalType === ApprovalTypeEnum.PASS ? '确认通过' : '确认拒绝' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="PaymentDialog">
import { ref, reactive, computed, watch } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { ApprovalTypeEnum, PaymentMethodList } from '@/configs/enum'
import type { Contract } from '@/api/contract/type'

// Props 定义（接收父组件参数）
const props = defineProps<{
  modelValue: boolean
  approvalType: ApprovalTypeEnum
  paymentRecord?: any
  contract?: Contract
}>()

// 事件定义（向父组件传递数据）
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: any): void
}>()

// 响应式状态
const innerVisible = ref(props.modelValue)
const formRef = ref<InstanceType<typeof ElForm>>()
const form = reactive({
  comment: '',
  actualAmount: null as number | null,
  paymentMethod: null as number | null,
  paymentTime: ''
})

// 计算属性
const dialogTitle = computed(() => {
  return props.approvalType === ApprovalTypeEnum.PASS ? '审核通过' : '审核不通过'
})
const isPass = computed(() => props.approvalType === ApprovalTypeEnum.PASS)
const isReject = computed(() => props.approvalType === ApprovalTypeEnum.REJECT)
const paymentMethods = computed(() => Object.values(PaymentMethodList))
const unpaidAmount = computed(() => {
  // 本次付款金额 = 应回款金额（审核通过时）/ 用户输入的实际金额（审核拒绝时）
  return isReject.value && form.actualAmount !== null ? form.actualAmount : props.paymentRecord?.amount || 0
})
const isSubmitDisabled = computed(() => {
  if (isPass.value) {
    return !form.paymentMethod || !form.paymentTime
  } else if (isReject.value) {
    return form.actualAmount === null || form.actualAmount <= 0 || !form.comment.trim()
  }
  return true
})

// 表单校验规则（与后端校验一致）
const rules = computed(() => ({
  paymentMethod: [{ required: isPass.value, message: '请选择支付方式', trigger: 'change' }],
  paymentTime: [{ required: isPass.value, message: '请选择支付时间', trigger: 'change' }],
  actualAmount: [
    { required: isReject.value, message: '请输入实际回款金额', trigger: 'blur' },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (!isReject.value) return callback()
        if (value === null || value === undefined || isNaN(value)) {
          callback(new Error('请输入有效金额'))
        } else if (value <= 0) {
          callback(new Error('金额必须大于0'))
        } else if (value > (props.paymentRecord?.amount || 0)) {
          callback(new Error(`不能超过应回款金额 ${formatCurrency(props.paymentRecord?.amount)}`))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  comment: [{ required: isReject.value, message: '请填写拒绝原因', trigger: 'blur' }]
}))

/**
 * 辅助函数：格式化金额
 */
const formatCurrency = (value?: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num !== undefined && num !== null && !isNaN(num) ? `¥${num.toFixed(2)}` : '¥0.00'
}

/**
 * 辅助函数：禁用过去的日期（支付时间不能选过去）
 */
const disabledPastDate = (time: Date) => {
  return time < new Date(new Date().setHours(0, 0, 0, 0))
}

/**
 * 提交表单（向父组件传递完整参数）
 */
const handleSubmit = async () => {
  if (!formRef.value || !props.paymentRecord?.id) return

  try {
    // 前端表单校验
    await formRef.value.validate()

    // 组装提交参数（与后端 ApprovalQuery 字段完全对齐）
    const submitData = {
      id: props.paymentRecord.id, // 回款ID
      type: isPass.value ? 0 : 1, // 审核类型（0=通过，1=拒绝）
      comment: form.comment.trim(), // 审核备注/拒绝原因
      actualAmount: isReject.value ? form.actualAmount : props.paymentRecord.amount, // 实际回款金额
      ...(isPass.value && {
        paymentMethod: form.paymentMethod, // 支付方式（通过时必填）
        paymentTime: form.paymentTime // 支付时间（通过时必填）
      })
    }

    // 向父组件传递参数，触发API调用
    emit('submit', submitData)
  } catch (error: any) {
    console.error('表单校验失败:', error)
    ElMessage.error('表单校验失败，请检查输入项')
  }
}

/**
 * 取消操作
 */
const handleCancel = () => {
  emit('update:modelValue', false)
}

/**
 * 弹窗关闭前处理（清空表单）
 */
const handleBeforeClose = (done: () => void) => {
  formRef.value?.clearValidate()
  resetForm()
  done()
}

/**
 * 弹窗关闭后处理（清空表单）
 */
const handleClosed = () => {
  formRef.value?.clearValidate()
  resetForm()
}

/**
 * 重置表单数据
 */
const resetForm = () => {
  form.comment = ''
  form.actualAmount = null
  form.paymentMethod = null
  form.paymentTime = ''
}

// 监听父组件 modelValue 变化（同步弹窗显示状态）
watch(
  () => props.modelValue,
  (val) => {
    innerVisible.value = val
    // 打开弹窗时重置表单
    if (val) resetForm()
  }
)

// 监听审核类型变化（切换通过/拒绝时重置表单）
watch(
  () => props.approvalType,
  () => {
    formRef.value?.clearValidate()
    resetForm()
  }
)
</script>

<style scoped>
.el-form-item {
  margin-bottom: 16px;
}
.el-dialog__footer {
  padding: 12px 20px;
}
.form-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}
.el-textarea__inner {
  resize: none;
}
</style>
