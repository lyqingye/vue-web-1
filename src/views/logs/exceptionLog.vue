<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: auto;">
        <el-form :inline="true">

          <el-form-item label="错误码">
            <el-input v-model="table.pageQuery.data.exceptionCode" placeholder="可选" />
          </el-form-item>
          
          <el-form-item label="用户名">
            <el-input v-model="table.pageQuery.data.userName" placeholder="可选" />
          </el-form-item>
          
          <el-form-item label="">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="table.pageQuery.data.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
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
          <el-table-column label="错误码" width="100">
            <template slot-scope="scope">
              <el-tag type="info">
                {{ scope.row.exceptionCode }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="异常类型" width="250" align="center">
            <template slot-scope="scope">
              <el-tag type="danger">
                {{ scope.row.exceptionType }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="异常位置" width="400" align="center">
            <template slot-scope="scope">
              <el-tag type="danger">
                {{ scope.row.exceptionPosition }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="调用者" width="150" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.refUserName != null" type="info">{{ scope.row.refUserName }}</el-tag>
              <el-tag v-if="scope.row.refUserName == null" type="info">UNKNOWN</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="异常发生时间" width="250" align="center">
            <template slot-scope="scope">
              <el-tag>
                <i class="el-icon-time" />
                <span style="margin-left: 5px">{{ scope.row.createTime }}</span>
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" min-width="190">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="handleShowLogDetailLog(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <!-- 底部栏 用于分页-->
      <el-footer style="text-align: right;height: auto;">
        <pagination :total="table.pageInfo.total" :page.sync="table.pageInfo.pageNum" :limit.sync="table.pageInfo.pageSize" @pagination="handlePageQuery" />
      </el-footer>
    </el-container>

    <!--日志详情对话框-->
    <el-dialog title="日志详情" modal :visible.sync="logDetailDialog.isShow" width="auto">
      <el-form label-position="right" label-width="120px">
        <el-form-item label="错误码">
          <el-tag type="danger">{{ logDetailDialog.data.exceptionCode }}</el-tag>
        </el-form-item>

        <el-form-item label="发生时间">
          <el-tag><i class="el-icon-time" /><span style="margin-left: 5px">{{ logDetailDialog.data.createTime }}</span></el-tag>
        </el-form-item>

        <el-form-item label="异常类型">
          <el-tag type="danger">{{ logDetailDialog.data.exceptionType }}</el-tag>
        </el-form-item>

        <el-form-item label="异常位置">
          <el-tag type="danger">{{ logDetailDialog.data.exceptionPosition }}</el-tag>
        </el-form-item>

        <el-form-item label="请求用户">
          <el-tag v-if="logDetailDialog.data.refUserName != null" type="info">{{ logDetailDialog.data.refUserName }}</el-tag>
        </el-form-item>

        <el-form-item v-if="!logDetailDialog.data.isSuccess" label="异常信息" style="white-space: pre-line;">
          <pre>{{ logDetailDialog.data.stackTrace }}</pre>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExceptionLogPageInfo
} from '@/api/logs/exceptionLog'

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
            dateRange: [],
            exceptionCode: null,
            userName: null,
          }
        }
      },

      // 日志详情窗口信息
      logDetailDialog: {
        isShow: false,
        data: {}
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
      getExceptionLogPageInfo(pagerRequest).then(resp => {
        this.table.pageInfo = resp.data
        this.table.loading = false
      })
    },

    handleShowLogDetailLog: function(data) {
      this.logDetailDialog.isShow = true
      this.logDetailDialog.data = data
    }
  }
}
</script>

<style scoped>
  pre {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;;
  }
</style>
