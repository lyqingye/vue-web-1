<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: 20px;">
        <el-button v-permission="['permission:add']" type="success" icon="el-icon-plus" size="mini" style="float: right;" @click="addPermissionDialog.isShow = true">新增</el-button>
      </el-header>

      <!-- 数据表格 -->
      <el-main ref="maintab">
        <el-table
          ref="table"
          v-loading="table.loading"
          :data="table.data"
          style="width: 100%"
          row-key="id"
          border
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="id" label="ID" width="100" />

          <el-table-column prop="permissionName" label="权限名称" width="250" />

          <el-table-column prop="remark" label="权限备注" width="300" />

          <el-table-column prop="isEnable" label="是否启用" width="80" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isEnable"
                :name="scope.row.permissionName"
                @change="handlePermissionEnable(scope.row)"
              />
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="190">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
              <el-button slot="reference" icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!-- 底部栏 用于分页-->
      <el-footer style="height:35px;" />
    </el-container>

    <!--添加权限对话框-->
    <el-dialog title="添加权限" modal :visible.sync="addPermissionDialog.isShow" width="25%">
      <el-form>

        <el-form-item label="父节点">
          <el-select v-model="addPermissionDialog.formData.parentId" placeholder="请选择父节点">
            <el-option v-for="item in addPermissionDialog.parentOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="权限名称">
          <el-input v-model="addPermissionDialog.formData.permissionName" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="addPermissionDialog.formData.remark" type="textarea" />
        </el-form-item>

        <el-form-item label="是否启用">
          <el-switch v-model="addPermissionDialog.formData.isEnable" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPermissionDialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!--更新权限对话框-->
    <el-dialog title="更新权限" modal :visible.sync="updatePermissionDialog.isShow" width="25%">
      <el-form>

        <el-form-item label="父节点">
          <el-select v-model="updatePermissionDialog.formData.parentId" placeholder="请选择父节点">
            <el-option v-for="item in updatePermissionDialog.parentOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="权限名称">
          <el-input v-model="updatePermissionDialog.formData.permissionName" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="updatePermissionDialog.formData.remark" type="textarea" />
        </el-form-item>

        <el-form-item label="是否启用">
          <el-switch v-model="updatePermissionDialog.formData.isEnable" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatePermissionDialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="doUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  updatePermission,
  deletePermission,
  updatePermissionIsEnable
} from '@/api/security'
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  data() {
    return {
      table: {
        data: [],
        loading: false
      },

      addPermissionDialog: {
        isShow: false,
        parentOptions: [{
          label: '根节点',
          value: 0
        }],
        formData: {
          parentId: null,
          permissionName: null,
          remark: null,
          isEnable: false
        }
      },

      updatePermissionDialog: {
        isShow: false,
        formData: {
          id: null,
          parentId: null,
          permissionName: null,
          remark: null,
          isEnable: false
        }
      }
    }
  },
  created() {
    this.loadPermissionList()
  },
  methods: {
    loadPermissionList: function() {
      this.table.loading = true
      getPermissionList().then(resp => {
        this.table.data = resp.data
        this.table.loading = false
        this.loadPermissionParentList()
      })
    },

    loadPermissionParentList: function() {
      this.addPermissionDialog.parentOptions = [this.addPermissionDialog.parentOptions[0]]
      this.table.data.map(node => {
        this.addPermissionDialog.parentOptions.push({
          label: node.permissionName,
          value: node.id
        })
      })
    },

    handleDelete: function(index, data) {
      this.$confirm('你确定要删除 ' + data.permissionName + ' 权限值吗？', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        deletePermission(data.id).then(resp => {
          if (resp.status === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.loadPermissionList()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
      }).catch(() => {
        // not do anything
      })
    },

    handleUpdate: function(index, data) {
      this.updatePermissionDialog.formData = data
      this.updatePermissionDialog.isShow = true

      // 更新权限对话框中的父节点选择框中不能出现自身
      this.updatePermissionDialog.parentOptions = this.addPermissionDialog.parentOptions.filter(item => {
        return item.value !== data.id
      })
    },

    doUpdate: function() {
      updatePermission(this.updatePermissionDialog.formData).then(resp => {
        if (resp.status === 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.loadPermissionList()
        } else {
          this.$message({
            message: '更新失败',
            type: 'error'
          })
        }
        this.updatePermissionDialog.isShow = false
      })
    },

    handleAdd: function() {
      addPermission(this.addPermissionDialog.formData).then(resp => {
        if (resp.status === 0) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.loadPermissionList()
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
        this.addPermissionDialog.isShow = false
      })
    },

    handlePermissionEnable: function(data) {
      updatePermissionIsEnable(data.id).then(resp => {
        if (resp.status === 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.loadPermissionList()
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
