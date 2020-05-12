<template>

  <el-form>

    <el-form-item label="旧密码">
      <el-input v-model.trim="updateData.oldPassword" type="password" />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input v-model.trim="updateData.newPassword" type="password" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  updateUserPassword
} from '@/api/security'

export default {
  data() {
    return {
      updateData: {
        oldPassword: null,
        newPassword: null
      }
    }
  },
  methods: {
    submit() {
      updateUserPassword(this.updateData).then(resp => {
        if (resp.status === 0) {
          this.$message({
            message: '更新成功, 请注销后重新登录',
            type: 'success'
          })
        } else {
          this.$message({
            message: '更新失败',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
