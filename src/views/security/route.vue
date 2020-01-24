<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: 20px;">
        <el-button type="success" icon="el-icon-plus" size="mini" style="float: right;" @click="addRouteDialog.isShow = true">新增</el-button>
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

          <el-table-column prop="title" label="菜单名称" width="150" />

          <el-table-column prop="routerPath" label="路由地址" width="150" />

          <el-table-column prop="componentName" label="组件名称" width="150" />

          <el-table-column prop="icon" label="菜单图标" width="80" align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.icon.startsWith('el:')" :class="'el-icon-' + scope.row.icon.substr(3)" />
              <svg-icon v-if="scope.row.icon.startsWith('svg:')" :icon-class="scope.row.icon.substr(4)" />
            </template>
          </el-table-column>

          <el-table-column prop="isHidden" label="侧边栏显示" width="100" align="center">
            <template slot-scope="scope">
              <el-switch v-model="!scope.row.isHidden" :name="scope.row.componentName" />
            </template>
          </el-table-column>

          <el-table-column prop="isShowTagView" label="tag-view显示" width="110" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isShowTagView" :name=" 'affix' + scope.row.componentName" />
            </template>
          </el-table-column>

          <el-table-column prop="isShowBreadcrumb" label="面包屑显示" width="100" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isShowBreadcrumb" :name="'breadcrumb' +scope.row.componentName" />
            </template>
          </el-table-column>

          <el-table-column prop="noCache" label="页面缓存" width="80" align="center">
            <template slot-scope="scope">
              <el-switch v-model="!scope.row.noCache" :name="'noCache' + scope.row.componentName" />
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="190">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
              <el-button slot="reference" icon="el-icon-delete" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!-- 底部栏 用于分页-->
      <el-footer style="height:35px;" />
    </el-container>

    <!--添加菜单对话框-->
    <el-dialog title="添加菜单路由" :visible.sync="addRouteDialog.isShow" width="25%">
      <el-form label-position="left" label-width="120px">

        <el-form-item label="父节点">
          <el-select v-model="addRouteDialog.formData.parentId" placeholder="请选择父节点">
            <el-option v-for="item in parentOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="菜单标题">
          <el-input v-model="addRouteDialog.formData.title" />
        </el-form-item>

        <el-form-item label="路由地址">
          <el-input v-model="addRouteDialog.formData.remark" />
        </el-form-item>

        <el-form-item label="重定向地址">
          <el-input v-model="addRouteDialog.formData.remark" />
        </el-form-item>

        <el-form-item label="组件名">
          <el-select v-model="addRouteDialog.formData.componentName" placeholder="请选择父节点">
            <el-option v-for="item in componentOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="菜单图标">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="addRouteDialog.formData.icon" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" size="medium" @click="isIconPickerDialogShow = true" />
            </el-form-item>
          </el-form>
        </el-form-item>
        
        <el-form-item label="菜单权重">
          <el-input v-model="addRouteDialog.formData.weight" />
        </el-form-item>

        <el-form-item label="在侧边栏显示">
          <el-switch v-model="!addRouteDialog.formData.isHidden" />
        </el-form-item>

        <el-form-item label="在TagView显示">
          <el-switch v-model="addRouteDialog.formData.isShowTagView" />
        </el-form-item>

        <el-form-item label="在面包屑显示">
          <el-switch v-model="addRouteDialog.formData.isShowBreadcrumb" />
        </el-form-item>

        <el-form-item label="缓存页面">
          <el-switch v-model="!addRouteDialog.formData.noCache" />
        </el-form-item>

        <el-form-item label="激活菜单">
          <el-switch v-model="addRouteDialog.formData.isActive" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRouteDialog.isShow = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!--图标选择窗口-->
    <el-dialog title="图标选择" :visible.sync="isIconPickerDialogShow">
      <iconPicker v-on:picked-icon="onSelectedIcon" />
    </el-dialog>
  </div>
</template>

<script>
import iconPicker from '@/components/IconPicker'
import {
  componentMap
} from '@/router'
import {
  getMenuRouterList,
  getPermissionList
} from '@/api/security'

export default {
  components: {
    iconPicker
  },
  data() {
    return {
      parentOptions: [{
        value: 0,
        label: '顶级路由'
      }],

      componentOptions: Array.from(componentMap.keys()).map(v => {
        return {
          label: v,
          value: v
        }
      }),
      isIconPickerDialogShow: false,

      permissionTree: [],

      table: {
        loading: false,
        data: []
      },
      addRouteDialog: {
        isShow: false,
        formData: {
          parentId: null,
          title: null,
          routerPath: null,
          redirect: null,
          componentName: null,
          isHidden: false,
          alwaysShow: false,
          icon: null,
          noCache: true,
          isShowTagView: true,
          isShowBreadcrumb: true,
          isActive: false,
          weight: 0
        }
      }
    }
  },

  created() {
    this.loadRouterList()
    this.loadPermissionList()
  },
  methods: {
    loadRouterList: function() {
      this.table.loading = true
      getMenuRouterList().then(resp => {
        this.table.data = resp.data
        this.table.loading = false
      })
    },

    loadPermissionList: function() {
      this.table.loading = true
      getPermissionList().then(resp => {
        this.permissionTree = this.recursionMapPermissionList(resp.data)
        console.log(this.permissionTree)
        var permissionIdList = []
        permissionIdList[0] = 2
        console.log(permissionIdList.length)
        console.log(this.recursionFilterPermissionTree(this.permissionTree, permissionIdList))
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

    onSelectedIcon: function(icon) {
      console.log(icon)
      this.addRouteDialog.formData.icon = icon
      this.isIconPickerDialogShow = false
    }
  }
}
</script>
