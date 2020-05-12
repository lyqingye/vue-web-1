<template>
  <el-form>
    <el-form-item>

      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"

        :on-remove="handleRemove"
        :class="{hide:hideUpload}"
        :on-change="handleChange"
      >
        <i class="el-icon-plus" />
      </el-upload>

    </el-form-item>
    <el-form-item label="简介">
      <el-input v-model.trim="updateData.introduction" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  updateUserAvatarData
} from '@/api/security'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          introduction: ''
        }
      }
    }
  },
  data() {
    return {
      hideUpload: false,
      limitCount: 1,

      updateData: {
        introduction: null,
        avatar: null
      }
    }
  },
  created() {
    this.updateData.introduction = this.user.introduction
  },
  methods: {

    submit() {
      updateUserAvatarData(this.updateData).then(resp => {
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
    },

    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
    },

    handleChange(file, fileList) {
      file = file.raw

      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      if (isJPG && isLt2M) {
        const fd = new FormData()
        fd.append('file', file)
        // 预览本地图
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
          this.updateData.avatar = event.target.result
        }
      }
      this.hideUpload = fileList.length >= this.limitCount
    }
  }
}
</script>
<style>
.hide .el-upload--picture-card {
    display: none;
}
</style>
