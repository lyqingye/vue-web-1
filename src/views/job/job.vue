<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: auto;">
        <el-form :inline="true">
          <el-button
            v-permission="['role:add']"
            icon="el-icon-plus"
            style="float: right;"
            type="success"
            size="small"
            @click="addDialog.isShow = true"
          >添加</el-button>
        </el-form>
      </el-header>

      <!-- 数据表格 -->
      <el-main ref="maintab">
        <el-table ref="table" v-loading="table.loading" :data="table.pageInfo.list" style="width: 100%" row-key="id" border>
          <el-table-column prop="id" label="ID" width="100" />

          <el-table-column label="Job类" width="400" align="center">
            <template slot-scope="scope">
              <el-tag type="info">{{ scope.row.jobRefClass }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="cron表达式" width="200" align="center">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.cronExpression }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isEnable" type="success">启用</el-tag>
              <el-tag v-if="!scope.row.isEnable" type="danger">禁用</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="jobRemark" label="备注" width="200" />

          <el-table-column label="操作" fixed="right" min-width="190">
            <template slot-scope="scope">
              <el-button :disabled="!scope.row.isEnable" icon="el-icon-edit" size="mini" type="warning" @click="doPause(scope.row)">暂停</el-button>
              <el-button :disabled="scope.row.isEnable" icon="el-icon-edit" size="mini" type="primary" @click="doResume(scope.row)">恢复</el-button>
              <el-button icon="el-icon-delete" size="mini" type="info" @click="handleUpdate(scope.row)">更新</el-button>
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="doDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!-- 底部栏 用于分页-->
      <el-footer style="text-align: right;height: auto;">
        <pagination :total="table.pageInfo.total" :page.sync="table.pageInfo.pageNum" :limit.sync="table.pageInfo.pageSize" @pagination="handlePageQuery" />
      </el-footer>
    </el-container>

    <!--更新对话框-->
    <el-dialog title="更新" modal :visible.sync="updateDialog.isShow" width="30%">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="cron表达式">
          <el-input v-model="updateDialog.formData.cronExpression" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="updateDialog.formData.jobRemark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="doUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!--添加对话框-->
    <el-dialog title="添加" modal :visible.sync="addDialog.isShow" width="30%">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="Job类">
          <el-input v-model="addDialog.formData.jobRefClass" />
        </el-form-item>

        <el-form-item label="cron表达式">
          <el-input v-model="addDialog.formData.cronExpression" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="addDialog.formData.jobRemark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getJobPageInfo,
  addJob,
  updateJob,
  pauseJob,
  resumeJob,
  deleteJob
} from '@/api/job/job'

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
      dictTypeList: [],
      table: {
        loading: false,

        // 分页总条数
        pageInfo: {},

        // 额外查询条件参数
        pageQuery: {
          pageNumber: 1,
          pageSize: 10,
          data: null
        }
      },

      // 更新窗口
      updateDialog: {
        isShow: false,
        formData: {
          id: null,
          jobRemark: null,
          cronExpression: null
        }
      },

      // 添加窗口
      addDialog: {
        isShow: false,
        formData: {
          jobRemark: null,
          cronExpression: null,
          jobRefClass: null
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
      getJobPageInfo(pagerRequest).then(resp => {
        this.table.pageInfo = resp.data
        this.table.loading = false
      })
    },

    handleUpdate: function(data) {
      this.updateDialog.formData = data
      this.updateDialog.isShow = true
    },

    doUpdate: function() {
      updateJob(this.updateDialog.formData).then(resp => {
        if (resp.status === 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.handleQuery()
        } else {
          this.$message({
            message: '更新失败',
            type: 'error'
          })
        }
      })
      this.updateDialog.isShow = false
    },

    doAdd: function() {
      addJob(this.addDialog.formData).then(resp => {
        if (resp.status === 0) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.handleQuery()
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
      })

      this.addDialog.isShow = false
    },

    doDelete: function(data) {
      this.$confirm('你确定要删除 ' + data.jobRefClass + ' 任务吗？', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        deleteJob(data.id).then(resp => {
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
    },

    doPause: function(data) {
      this.$confirm('你确定要暂停 ' + data.jobRefClass + ' 任务吗？', '警告', {
        confirmButtonText: '暂停',
        cancelButtonText: '取消'
      }).then(() => {
        pauseJob(data.id).then(resp => {
          if (resp.status === 0) {
            this.$message({
              message: '暂停成功',
              type: 'success'
            })
            this.handleQuery()
          } else {
            this.$message({
              message: '暂停失败',
              type: 'error'
            })
          }
        })
      }).catch(() => {
        // not do anything
      })
    },

    doResume: function(data) {
      this.$confirm('你确定要恢复 ' + data.jobRefClass + ' 任务吗？', '警告', {
        confirmButtonText: '恢复',
        cancelButtonText: '取消'
      }).then(() => {
        resumeJob(data.id).then(resp => {
          if (resp.status === 0) {
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
