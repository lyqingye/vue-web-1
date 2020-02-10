<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: auto;">
        <el-button v-permission="['user:add']"type="success" size="mini" style="float: right;" @click="handleBackup">备份</el-button>
      </el-header>

      <!-- 数据表格 -->
      <el-main ref="maintab">
        <el-table ref="table" v-loading="table.loading" :data="table.pageInfo.list" style="width: 100%" row-key="id" border>
          <el-table-column label="文件名" width="200" align="left">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.fileName }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="文件大小" width="150" align="center">
            <template slot-scope="scope">
              <el-tag type="info">{{ scope.row.fileSize }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="备份时间" width="250" align="center">
            <template slot-scope="scope">
              <el-tag>
                <i class="el-icon-time" />
                <span style="margin-left: 5px">{{ scope.row.createTime }}</span>
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="190">
            <template slot-scope="scope">
              <el-button icon="el-icon-refresh" size="mini" type="warning" @click="handleRecover(scope.row)">恢复</el-button>
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDeleteFile(scope.row)">删除</el-button>
              <el-button icon="el-icon-download" size="mini" type="primary">
                <a :href="scope.row.downLoadUrl">下载</a>
              </el-button>
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
  getDbBackupPageInfo,
  backup,
  recover,
  deleteFile
} from '@/api/dbbackup/dbbackup'

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
          pageSize: 10
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
      getDbBackupPageInfo(pagerRequest).then(resp => {
        this.table.pageInfo = resp.data
        this.table.loading = false
      })
    },

    handleBackup: function() {
      this.table.loading = true
      backup().then(resp => {
        if (resp.data === 'true') {
          this.$message({
            message: '备份成功',
            type: 'success'
          })
          this.handleQuery()
        } else {
          this.$message({
            message: '备份失败',
            type: 'error'
          })
        }
        this.table.loading = false
      })
    },

    handleRecover: function(data) {
      this.$confirm('你确定要使用 ' + data.fileName + ' 恢复到数据库吗？（恢复后会覆盖原来的数据）', '警告', {
        confirmButtonText: '恢复',
        cancelButtonText: '取消'
      }).then(() => {
        recover(data.fileName).then(resp => {
          this.table.loading = true
          if (resp.data === 'true') {
            this.$message({
              message: '恢复成功',
              type: 'success'
            })
            this.handleQuery()
          } else {
            this.$message({
              message: '恢复失败',
              type: 'error'
            })
          }
          this.table.loading = false
        })
      }).catch(() => {
        // not do anything
      })
    },

    handleDeleteFile: function(data) {
      this.$confirm('你确定要删除 ' + data.fileName + ' 数据库备份文件吗？(删除后无法恢复)', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        this.table.loading = true
        deleteFile(data.fileName).then(resp => {
          if (resp.data === 'true') {
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
          this.table.loading = false
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
