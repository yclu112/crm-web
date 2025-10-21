<!-- <template>
  <el-dialog v-model="visible" :title="row.id ? '编辑用户' : '新增用户'" width="600px" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="用户名称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入用户名称" />
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="公司" prop="company">
        <el-input v-model="form.company" placeholder="请输入公司名称" />
      </el-form-item>

      <el-form-item label="角色" prop="roleId">
        <el-select v-model="form.roleId" placeholder="请选择角色">
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template> -->

<!-- <script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { addUser, editUser, SysUser } from '@/api/modules/user'
import { getRoleList } from '@/api/modules/role'

// 定义props
const props = defineProps<{
  visible: boolean
  row: Partial<SysUser.ReqEditUserParams>
}>()

// 定义emit
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

// 表单引用
const formRef = ref()

// 角色列表
const roleList = ref([])

// 表单数据
const form = reactive<SysUser.ReqEditUserParams>({
  id: undefined,
  nickname: '',
  phone: '',
  email: '',
  company: '',
  status: 1,
  roleId: 0
})

// 表单规则
const rules = {
  nickname: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 监听row变化
watch(
  () => props.row,
  (val) => {
    Object.assign(form, val)
  },
  { deep: true, immediate: true }
)

// 监听visible变化
watch(
  () => props.visible,
  (val) => {
    if (val && formRef.value) {
      formRef.value.clearValidate()
    }
  }
)

// 初始化获取角色列表
onMounted(async () => {
  try {
    const res = await getRoleList({ page: 1, limit: 100 })
    roleList.value = res.data.list
  } catch (error) {
    console.error('获取角色列表失败', error)
  }
})

// 取消
const handleCancel = () => {
  emit('close')
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (form.id) {
      // 编辑
      await editUser(form)
      ElMessage.success('编辑成功')
    } else {
      // 新增
      await addUser(form)
      ElMessage.success('新增成功')
    }

    emit('success')
  } catch (error) {
    console.error('操作失败', error)
  }
}
</script> -->
