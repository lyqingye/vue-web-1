<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: auto;">
        <el-form :inline="true">
          <el-form-item label="手机号">
            <el-input v-model="table.pageQuery.data.refMember" placeholder="可选" />
          </el-form-item>

          <el-form-item>
            <el-button
              v-permission="['role:add']"
              icon="el-icon-search"
              style="float: right;"
              @click="handleQuery"
            >查询</el-button>
          </el-form-item>
        </el-form>

      </el-header>

      <!-- 数据表格 -->
      <el-main ref="maintab">
        <el-table ref="table" v-loading="table.loading" :data="table.pageInfo.list" style="width: 100%" row-key="id" border>
          <el-table-column prop="vetoId" label="ID" width="100" />

          <el-table-column prop="title" label="问卷标题" width="200" />

          <el-table-column label="发布状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isPublic" type="success">已发布</el-tag>
              <el-tag v-if="!scope.row.isPublic" type="info">未发布</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="所属用户" width="150" align="center">
            <template slot-scope="scope">
              <el-tag type="info">{{ scope.row.refMember }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" width="260" align="center">
            <template slot-scope="scope">
              <el-tag>
                <i class="el-icon-time" />
                <span style="margin-left: 5px">{{ scope.row.createTime }}</span>
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDeleteVeto(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!-- 底部栏 用于分页-->
      <el-footer style="text-align: right;height: auto;">
        <pagination :total="table.pageInfo.total" :page.sync="table.pageInfo.pageNum" :limit.sync="table.pageInfo.pageSize" @pagination="handlePageQuery" />
      </el-footer>
    </el-container>

  </div>
</template>

<script>

import {
  getVetoFormPageInfo,
  deleteVeto
} from '@/api/admin/veto'

import pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js'
export default {
  components: {
    pagination
  },
  directives: {
    permission
  },
  data() {
    return {
      table: {
        loading: false,

        // 分页总条数
        pageInfo: {},

        // 额外查询条件参数
        pageQuery: {
          pageNumber: 1,
          pageSize: 10,
          data: {
            refMember: null
          }
        }
      }
    }
  },

  methods: {
    handleQuery: function() {
      this.handlePageQuery(this.table.pageQuery)
    },

    handlePageQuery: function(pagerRequest) {
      this.table.loading = true
      pagerRequest.data = this.table.pageQuery.data
      getVetoFormPageInfo(pagerRequest).then(resp => {
        this.table.pageInfo = resp.data
        this.table.loading = false
      })
    },
    handleDeleteVeto: function(data) {
      this.$confirm('你确定要删除 ' + data.title + ' 问卷吗？', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        deleteVeto(data.vetoId).then(resp => {
          if (resp.status === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.handleQuery()
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
    }
  }
}
</script>

<style scoped>
  pre {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;;
  }
</style>
