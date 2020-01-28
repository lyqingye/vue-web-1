<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: 20px;">
        <el-button v-permission="['role:add']" type="success" icon="el-icon-plus" size="mini" style="float: right;" @click="addRoleDialog.isShow = true">新增</el-button>
      </el-header>

      <!-- 数据表格 -->
      <el-main ref="maintab">
        <el-table ref="table" v-loading="table.loading" :data="table.data" style="width: 100%" row-key="id" border>
          <el-table-column prop="id" label="ID" width="100" />

          <el-table-column prop="roleName" label="角色名称" width="250" />

          <el-table-column prop="remark" label="角色备注" width="250" />

          <el-table-column label="创建者"  align="center">
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
              <el-button v-permission="['role:delete']" slot="reference" icon="el-icon-delete" size="mini" type="danger" @click="handleDeleteRole(scope.$index, scope.row)">删除</el-button>
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

      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-circle-plus" />&nbsp;&nbsp;赋予角色权限
          </template>
          <el-tree
            ref="addRoleTree"
            :data="permissionTree"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :props="permissionTreeDefaultProps"
          />
        </el-collapse-item>
      </el-collapse>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog.isShow = false">取 消</el-button>
        <el-button v-permission="['role:add']" type="primary" @click="handleAddRole">确 定</el-button>
      </div>
    </el-dialog>

    <!--更新角色对话框-->
    <el-dialog title="更新角色" modal :visible.sync="updateRoleDialog.isShow" width="25%">
      <div v-loading="updateRoleDialog.updateLoading">
        <el-form label-position="left">
          <el-form-item label="角色名称">
            <el-input v-model="updateRoleDialog.formData.roleName" />
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="updateRoleDialog.formData.remark" type="textarea" />
          </el-form-item>

        </el-form>

        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              <i class="header-icon el-icon-circle-plus" />&nbsp;&nbsp;赋予角色权限
            </template>
            <el-tree
              ref="updateRoleTree"
              :data="permissionTree"
              show-checkbox
              default-expand-all
              node-key="id"
              highlight-current
              :props="permissionTreeDefaultProps"
              :default-checked-keys="updateRoleDialog.defaultCheckedPermissionIdList"
            />
          </el-collapse-item>
        </el-collapse>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="updateRoleDialog.isShow = false">取 消</el-button>
        <el-button v-permission="['role:update']" type="primary" @click="doUpdateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolePageInfo,
  addRole,
  updateRole,
  deleteRole,
  getPermissionList
} from '@/api/security'
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  data() {
    return {
      permissionTree: [],
      permissionTreeDefaultProps: {
        children: 'children',
        label: 'remark',
        checked: 'isEnable'
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

      addRoleDialog: {
        isShow: false,
        formData: {
          roleName: null,
          remark: null,
          permissionStatusList: []
        }
      },

      updateRoleDialog: {
        defaultCheckedPermissionIdList: [],
        isShow: false,
        updateLoading: false,
        formData: {
          id: null,
          roleName: null,
          remark: null,
          createTime: null,
          creatorName: null,
          permissionStatusList: []
        }
      }
    }
  },
  created() {
    this.loadRolePageInfo()
    this.loadPermissionList()
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

    loadPermissionList: function() {
      this.table.loading = true
      getPermissionList().then(resp => {
        this.permissionTree = resp.data
        // this.permissionTree = this.recursionMapPermissionList(resp.data)
        // todo 测试树形结构数据拉平为一维数组，然后将权限树形结构拉平，然后post到添加路由
        console.log(this.buildPermissionStatusList(this.permissionTree))
        this.table.loading = false
      })
    },

    /**
       * 递归将权限列表转换为 tree:
       * {
       *    id: null,
       *    label: null,
       *    children: []
       * }
       * @param {Object} permissionList
       */
    recursionMapPermissionList: function(permissionList) {
      const result = []
      if (permissionList !== null && permissionList.length !== 0) {
        permissionList.forEach(node => {
          const treeNode = {
            id: node.id,
            label: node.permissionName,
            children: null,
            checked: false
          }
          treeNode.children = this.recursionMapPermissionList(node.children)
          result.push(treeNode)
        })
      }
      return result
    },

    /**
       * 根据所给的权限ID列表，过滤所给的 权限树
       * @param {Object} permissionTree 权限树
       * @param {Object} selectedPermissionIdList 权限ID列表
       */
    recursionFilterPermissionTree: function(permissionTree, selectedPermissionIdList) {
      const result = []
      if (permissionTree !== null && permissionTree.length !== 0) {
        permissionTree.forEach(node => {
          const newNode = {
            id: node.id,
            label: node.label,
            children: null,
            checked: false
          }

          if (selectedPermissionIdList.length !== 0) {
            if (selectedPermissionIdList.includes(node.id)) {
              newNode.checked = true
            }
          }
          newNode.children = this.recursionFilterPermissionTree(node.children, selectedPermissionIdList)
          result.push(newNode)
        })
      }
      return result
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
      this.addRoleDialog.formData.permissionStatusList = this.buildPermissionStatusList(this.permissionTree, this.$refs.addRoleTree.getCheckedKeys())
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
      console.log(data)
      this.updateRoleDialog.formData = data
      this.updateRoleDialog.isShow = true
      // 坑！如果没有显示过更新窗口，那么 tree 不会被创建, 如果 tree 创建了
      // 那么 default-checked-keys 是不会双向数据绑定的，也就是说它就是个初始值
      // 解决方案：判断 tree 是否创建，如果没有创建者设置初始值，否则调用 setCheckedKeys 设置选中的 key
      if ('updateRoleTree' in this.$refs) {
        this.$refs.updateRoleTree.setCheckedKeys(data.permissionIdSet, false)
      } else {
        this.updateRoleDialog.defaultCheckedPermissionIdList = data.permissionIdSet
      }
    },

    doUpdateRole: function() {
      this.updateRoleDialog.updateLoading = true
      this.updateRoleDialog.formData.permissionStatusList = this.buildPermissionStatusList(this.permissionTree, this.$refs.updateRoleTree.getCheckedKeys())
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
        this.updateRoleDialog.updateLoading = false
        this.updateRoleDialog.isShow = false
      })
    },

    // helper functions
    buildPermissionStatusList: function(permissionTree, checkedKeys) {
      console.log(checkedKeys)
      const permissionStatusList = this.flatPermissionTreeToArray(permissionTree)
      if (permissionStatusList !== null) {
        permissionStatusList.forEach(status => {
          if (Array.isArray(checkedKeys) && checkedKeys.length) {
            if (checkedKeys.includes(status.permissionId)) {
              status.isEnable = true
            } else {
              status.isEnable = false
            }
          } else {
            status.isEnable = false
          }
        })
        return permissionStatusList
      }
      return []
    },

    flatPermissionTreeToArray: function(permissionTree) {
      let result = []
      if (permissionTree !== null) {
        result = [].concat(...permissionTree.map(item => [].concat({
          permissionId: item.id,
          isEnable: item.isEnable
        }, ...this.flatPermissionTreeToArray(item.children))))
      }
      return result
    }
  }
}
</script>
