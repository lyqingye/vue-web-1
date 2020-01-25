<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: 20px;">
        <el-button type="success" icon="el-icon-plus" size="mini" style="float: right;" @click="addRoleDialog.isShow = true">新增</el-button>
      </el-header>

      <!-- 数据表格 -->
      <el-main ref="maintab">
        <el-table ref="table" v-loading="table.loading" :data="table.data" style="width: 100%" row-key="id" border>
          <el-table-column prop="id" label="ID" width="100" />

          <el-table-column prop="roleName" label="角色名称" width="250" />

          <el-table-column prop="remark" label="角色备注" width="250" />

          <el-table-column label="创建者" width="100" align="center">
            <template slot-scope="scope">
              <el-tag
                type="success"
              >
                {{ scope.row.creatorName }}
              </el-tag>
            </template>

          </el-table-column>

          <el-table-column label="创建时间" width="250" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="190">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="handleUpdateRole(scope.$index, scope.row)">编辑</el-button>
              <el-button slot="reference" icon="el-icon-delete" size="mini" type="danger" @click="handleDeleteRole(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!-- 底部栏 用于分页-->
      <el-footer style="height:35px;text-align: right;">
        <el-pagination
          background
          :total="table.pagerRequest.total"
          :current-page="table.pagerRequest.pageNumber"
          :page-size="table.pagerRequest.pageSize"
          :page-sizes="[10,20]"
          layout="total,sizes,prev, pager, next, jumper"
          @current-change="handleTablePageChange"
          @size-change="handleTablePageSizeChange"
        />
      </el-footer>
    </el-container>

    <!--添加角色对话框-->
    <el-dialog title="添加角色" modal :visible.sync="addRoleDialog.isShow" width="25%">
      <el-form label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="addRoleDialog.formData.roleName" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="addRoleDialog.formData.remark" type="textarea" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRole">确 定</el-button>
      </div>
    </el-dialog>

    <!--更新角色对话框-->
    <el-dialog title="更新角色" modal :visible.sync="updateRoleDialog.isShow" width="25%">
      <el-form label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="updateRoleDialog.formData.roleName" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="updateRoleDialog.formData.remark" type="textarea" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateRoleDialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="doUpdateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolePageInfo,
  addRole,
  updateRole,
  deleteRole
} from '@/api/security'
export default {

  data() {
    return {
      table: {
        data: [],
        loading: false,
        pagerRequest: {
          pageNumber: 1,
          pageSize: 10,
          total: 0
        }
      },

      addRoleDialog: {
        isShow: false,
        formData: {
          roleName: null,
          remark: null
        }
      },

      updateRoleDialog: {
        isShow: false,
        formData: {
          id: null,
          roleName: null,
          remark: null,
          createTime: null,
          creatorName: null
        }
      }
    }
  },
  created() {
    this.loadRolePageInfo()
  },
  methods: {
    loadRolePageInfo: function() {
      this.table.loading = true
      getRolePageInfo(this.table.pagerRequest).then(resp => {
        this.table.data = resp.data.list
        this.table.pagerRequest.pageNumber = resp.data.pageNum
        this.table.pagerRequest.pageSize = resp.data.pageSize
        this.table.pagerRequest.total = resp.data.total
        this.table.loading = false
      })
    },

    handleTablePageChange: function(currentPage) {
      this.table.pagerRequest.pageNumber = currentPage
      this.loadRolePageInfo()
    },

    handleTablePageSizeChange: function(newPageSize) {
      this.table.pagerRequest.pageSize = newPageSize
      this.loadRolePageInfo()
    },

    handleAddRole: function() {
      addRole(this.addRoleDialog.formData).then(resp => {
        if (resp.status === 0) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.loadRolePageInfo()
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
        this.addRoleDialog.isShow = false
      })
    },

    handleDeleteRole: function(index, data) {
      this.$confirm('你确定要删除 ' + data.roleName + ' 角色吗？', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        deleteRole(data.id).then(resp => {
          if (resp.status === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.loadRolePageInfo()
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

    handleUpdateRole: function(index, data) {
      this.updateRoleDialog.formData = data
      this.updateRoleDialog.isShow = true
    },

    doUpdateRole: function() {
      updateRole(this.updateRoleDialog.formData).then(resp => {
        if (resp.status === 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.loadRolePageInfo()
        } else {
          this.$message({
            message: '更新失败',
            type: 'error'
          })
        }
        this.updateRoleDialog.isShow = false
      })
    }
  }
}
</script>
