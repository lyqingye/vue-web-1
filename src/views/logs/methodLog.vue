<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: auto;">
        <el-form :inline="true">
          <el-form-item label="执行状态">
            <el-select v-model="table.pageQuery.data.isSuccess" placeholder="可选">
              <el-option label="成功" value="true" />
              <el-option label="失败" value="false" />
            </el-select>
          </el-form-item>

          <el-form-item label="方法说明">
            <el-input v-model="table.pageQuery.data.remark" placeholder="可选" />
          </el-form-item>

          <el-form-item label="方法名">
            <el-input v-model="table.pageQuery.data.method" placeholder="可选" />
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
          <el-table-column prop="id" label="ID" width="100" />

          <el-table-column label="方法说明" width="150" align="left">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.remark != null" type="info">{{ scope.row.remark }}</el-tag>
              <el-tag v-if="scope.row.remark == null" type="info">UNKNOWN</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="method" label="方法名" width="250" />

          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isSuccess" type="success">成功</el-tag>
              <el-tag v-if="!scope.row.isSuccess" type="danger">失败</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="调用者" width="150" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.refUserName != null" type="info">{{ scope.row.refUserName }}</el-tag>
              <el-tag v-if="scope.row.refUserName == null" type="info">UNKNOWN</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="请求时间时间" width="250" align="center">
            <template slot-scope="scope">
              <el-tag>
                <i class="el-icon-time" />
                <span style="margin-left: 5px">{{ scope.row.requestTime }}</span>
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="请求用时" width="100" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.timeForUse <= 200" type="success">
                {{ scope.row.timeForUse }}ms
              </el-tag>
              <el-tag v-if="scope.row.timeForUse > 200 && scope.row.timeForUse <= 1000" type="warning">
                {{ scope.row.timeForUse }}ms
              </el-tag>
              <el-tag v-if="scope.row.timeForUse > 1000" type="danger">
                {{ scope.row.timeForUse }}ms
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="调用者IP" width="150" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.ip != null" type="info">{{ scope.row.ip }}</el-tag>
              <el-tag v-if="scope.row.ip == null" type="info">UNKNOWN</el-tag>
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
        <el-form-item label="方法备注">
          <el-tag v-if="logDetailDialog.data.remark != null" type="info">{{ logDetailDialog.data.remark }}</el-tag>
          <el-tag v-if="logDetailDialog.data.remark == null" type="info">UNKNOWN</el-tag>
        </el-form-item>

        <el-form-item label="状态">
          <el-tag v-if="logDetailDialog.data.isSuccess" type="success">成功</el-tag>
          <el-tag v-if="!logDetailDialog.data.isSuccess" type="danger">失败</el-tag>
        </el-form-item>

        <el-form-item label="类名">
          <el-tag v-if="logDetailDialog.data.clazz != null" type="info">{{ logDetailDialog.data.clazz }}</el-tag>
        </el-form-item>

        <el-form-item label="方法">
          <el-tag v-if="logDetailDialog.data.method != null" type="info">{{ logDetailDialog.data.method }}</el-tag>
        </el-form-item>

        <el-form-item label="请求用户">
          <el-tag v-if="logDetailDialog.data.refUserName != null" type="info">{{ logDetailDialog.data.refUserName }}</el-tag>
        </el-form-item>

        <el-form-item label="请求IP">
          <el-tag v-if="logDetailDialog.data.ip != null" type="info">{{ logDetailDialog.data.ip }}</el-tag>
        </el-form-item>

        <el-form-item label="请求时间">
          <el-tag><i class="el-icon-time" /><span style="margin-left: 5px">{{ logDetailDialog.data.requestTime }}</span></el-tag>
        </el-form-item>

        <el-form-item label="响应时间">

          <el-tag><i class="el-icon-time" /><span style="margin-left: 5px">{{ logDetailDialog.data.responseTime }}</span></el-tag>
        </el-form-item>

        <el-form-item label="耗时">
          <el-tag v-if="logDetailDialog.data.timeForUse <= 200" type="success">{{ logDetailDialog.data.timeForUse }}ms</el-tag>
          <el-tag v-if="logDetailDialog.data.timeForUse > 200 && logDetailDialog.data.timeForUse <= 1000" type="warning">
            {{ logDetailDialog.data.timeForUse }}ms
          </el-tag>
          <el-tag v-if="logDetailDialog.data.timeForUse > 1000" type="danger">
            {{ logDetailDialog.data.timeForUse }}ms
          </el-tag>
        </el-form-item>

        <el-form-item label="方法参数">
          <pre>{{ logDetailDialog.data.args }}</pre>
        </el-form-item>

        <el-form-item v-if="!logDetailDialog.data.isSuccess" label="异常信息" style="white-space: pre-line;">
          <pre>{{ logDetailDialog.data.exceptionContent }}</pre>
        </el-form-item>

        <el-form-item label="方法返回值" style="white-space: pre-line;">
          <pre>{{ logDetailDialog.data.result }}</pre>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMethodLogPageInfo
} from '@/api/logs/methodLog'

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
            ip: null,
            isSuccess: null,
            method: null,
            remark: null,
            startTime: null,
            endTime: null,
            userName: null
          }
        },
        dateRangePickerValue: []
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
      getMethodLogPageInfo(pagerRequest).then(resp => {
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
