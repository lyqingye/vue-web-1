<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: 20px;">
        <el-button type="success" icon="el-icon-plus" size="mini" style="float: right;" @click="addUserDialog.isShow = true">新增</el-button>
      </el-header>

      <!-- 数据表格 -->
      <el-main ref="maintab">
        <el-table ref="table" v-loading="table.loading" :data="table.data" style="width: 100%" row-key="id" border>
          <el-table-column prop="id" label="ID" width="100" />

          <el-table-column prop="userName" label="用户名称" width="250" />

          <el-table-column prop="mobile" label="手机" width="250" />

          <el-table-column prop="email" label="邮箱" width="250" />

          <el-table-column label="账号状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag
                v-if="!scope.row.isFrozen"
                type="success"
              >
                正常
              </el-tag>

              <el-tag
                v-if="scope.row.isFrozen"
                type="danger"
              >
                冻结
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
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="handleUpdateUser(scope.$index, scope.row)">编辑</el-button>
              <el-button slot="reference" icon="el-icon-delete" size="mini" type="danger" @click="handleDeleteUser(scope.$index, scope.row)">删除</el-button>
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

    <!--添加用户对话框-->
    <el-dialog title="添加用户" modal :visible.sync="addUserDialog.isShow" width="25%">
      <el-form label-position="right" label-width="70px">
        <el-form-item label="用户名称">
          <el-input v-model="addUserDialog.formData.userName" />
        </el-form-item>

        <el-form-item label="用户密码">
          <el-input v-model="addUserDialog.formData.password" type="password" />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="addUserDialog.formData.mobile" type="text" maxlength="11" />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="addUserDialog.formData.email" />
        </el-form-item>

        <el-form-item label="简介">
          <el-input v-model="addUserDialog.formData.introduction" type="textarea" />
        </el-form-item>

      </el-form>

      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-circle-plus" />&nbsp;&nbsp;用户关联角色
          </template>
          <el-tree
            ref="addUserTree"
            :data="roleTree"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :props="roleTreeDefaultProps"
          />
        </el-collapse-item>

      </el-collapse>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUser">确 定</el-button>
      </div>
    </el-dialog>

    <!--更新用户对话框-->
    <el-dialog title="更新用户" modal :visible.sync="updateUserDialog.isShow" width="25%">
      <div v-loading="updateUserDialog.updateLoading">
        <el-form label-position="right" label-width="70px">
          <el-form-item label="用户名称">
            <el-input v-model="updateUserDialog.formData.userName" />
          </el-form-item>

          <el-form-item label="用户密码">
            <el-input v-model="updateUserDialog.formData.password" type="password" placeholder="可选(如果需要修改密码)" />
          </el-form-item>

          <el-form-item label="手机号">
            <el-input v-model="updateUserDialog.formData.mobile" type="text" maxlength="11" />
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="updateUserDialog.formData.email" />
          </el-form-item>

          <el-form-item label="简介">
            <el-input v-model="updateUserDialog.formData.introduction" type="textarea" />
          </el-form-item>

          <el-form-item label="是否冻结">
            <el-switch
              v-model="updateUserDialog.formData.isFrozen"
            />
          </el-form-item>

        </el-form>

        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              <i class="header-icon el-icon-circle-plus" />&nbsp;&nbsp;用户关联角色
            </template>
            <el-tree
              ref="updateUserTree"
              :data="roleTree"
              show-checkbox
              default-expand-all
              node-key="id"
              highlight-current
              :props="roleTreeDefaultProps"
              :default-checked-keys="updateUserDialog.defaultCheckedRoleIdList"
            />
          </el-collapse-item>

        </el-collapse>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateUserDialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="doUpdateUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserPageInfo,
  addUser,
  updateUser,
  deleteUser,
  getRoleList
} from '@/api/security'
export default {

  data() {
    return {
      roleTree: [],
      roleTreeDefaultProps: {
        children: 'children',
        label: 'roleName',
        id: 'id'
      },
      table: {
        data: [],
        loading: false,
        pagerRequest: {
          pageNumber: 1,
          pageSize: 10,
          total: 0
        }
      },

      addUserDialog: {
        isShow: false,
        formData: {
          userName: null,
          password: null,
          mobile: null,
          email: null,
          introduction: null,
          roleCheckStatusList: []
        }
      },

      updateUserDialog: {
        updateLoading: false,
        defaultCheckedRoleIdList: [],
        isShow: false,
        formData: {
          id: null,
          userName: null,
          password: null,
          mobile: null,
          email: null,
          introduction: null,
          isFrozen: false,
          roleCheckStatusList: []
        }
      }
    }
  },
  created() {
    this.loadUserPageInfo()
    this.loadRoleList()
  },
  methods: {
    loadUserPageInfo: function() {
      this.table.loading = true
      getUserPageInfo(this.table.pagerRequest).then(resp => {
        this.table.data = resp.data.list
        this.table.pagerRequest.pageNumber = resp.data.pageNum
        this.table.pagerRequest.pageSize = resp.data.pageSize
        this.table.pagerRequest.total = resp.data.total
        this.table.loading = false
      })
    },

    loadRoleList: function() {
      getRoleList().then(resp => {
        // 以防万一直接用 树形结构
        this.roleTree = resp.data
      })
    },

    handleTablePageChange: function(currentPage) {
      this.table.pagerRequest.pageNumber = currentPage
      this.loadUserPageInfo()
    },

    handleTablePageSizeChange: function(newPageSize) {
      this.table.pagerRequest.pageSize = newPageSize
      this.loadUserPageInfo()
    },

    handleAddUser: function() {
      this.addUserDialog.formData.roleCheckStatusList = this.buildRoleStatusList(this.roleTree, this.$refs.addUserTree.getCheckedKeys())
      addUser(this.addUserDialog.formData).then(resp => {
        if (resp.status === 0) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.loadUserPageInfo()
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
        this.addUserDialog.isShow = false
      })
    },

    handleDeleteUser: function(index, data) {
      this.$confirm('你确定要删除 ' + data.userName + ' 用户吗？', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        deleteUser(data.id).then(resp => {
          if (resp.status === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.loadUserPageInfo()
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

    handleUpdateUser: function(index, data) {
      this.updateUserDialog.formData = data
      this.updateUserDialog.formData.password = null
      this.updateUserDialog.isShow = true
      console.log(data.roleIdSet)
      if ('updateUserTree' in this.$refs) {
        this.$refs.updateUserTree.setCheckedKeys(data.roleIdSet, false)
      } else {
        this.updateUserDialog.defaultCheckedRoleIdList = data.roleIdSet
      }
    },

    doUpdateUser: function() {
      this.updateUserDialog.updateLoading = true
      this.updateUserDialog.formData.roleCheckStatusList = this.buildRoleStatusList(this.roleTree, this.$refs.updateUserTree.getCheckedKeys())
      updateUser(this.updateUserDialog.formData).then(resp => {
        if (resp.status === 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.loadUserPageInfo()
        } else {
          this.$message({
            message: '更新失败',
            type: 'error'
          })
        }
        this.updateUserDialog.updateLoading = false
        this.updateUserDialog.isShow = false
      })
    },

    // help function

    // helper functions
    buildRoleStatusList: function(roleTree, checkedKeys) {
      const result = []

      if (Array.isArray(roleTree) && roleTree.length) {
        roleTree.forEach(role => {
          const checkStatus = {
            roleId: role.id,
            isEnable: false
          }
          if (Array.isArray(checkedKeys) && checkedKeys.length) {
            if (checkedKeys.includes(role.id)) {
              checkStatus.isEnable = true
            } else {
              checkStatus.isEnable = false
            }
          } else {
            checkStatus.isEnable = false
          }
          result.push(checkStatus)
        })
      }
      return result
    }

  }
}
</script>
