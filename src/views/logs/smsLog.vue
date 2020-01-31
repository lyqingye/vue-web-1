<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: auto;">
        <el-form :inline="true">
          <el-form-item label="执行状态">
            <el-select v-model="table.pageQuery.data.success" placeholder="可选">
              <el-option label="成功" value="true" />
              <el-option label="失败" value="false" />
            </el-select>
          </el-form-item>

          <el-form-item label="手机号">
            <el-input v-model="table.pageQuery.data.mobile" placeholder="可选" />
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

          <el-table-column label="手机号" width="150" align="left">
            <template slot-scope="scope">
              <el-tag type="info">{{ scope.row.phonePrefix + ' ' + scope.row.mobile }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="短信厂家" width="120" align="center">
            <template slot-scope="scope">
              <el-tag type="info">{{ scope.row.manufacturerCode}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.success" type="success">成功</el-tag>
              <el-tag v-if="!scope.row.success" type="danger">失败</el-tag>
            </template>
          </el-table-column>

         <el-table-column label="短信类型" width="150" align="center">
           <template slot-scope="scope">
             <el-tag type="info">{{ scope.row.smsType}}</el-tag>
           </template>
         </el-table-column>

          <el-table-column label="请求时间时间" width="250" align="center">
            <template slot-scope="scope">
              <el-tag>
                <i class="el-icon-time" />
                <span style="margin-left: 5px">{{ scope.row.sendTime }}</span>
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
        <el-form-item label="手机号">
          <el-tag>{{ logDetailDialog.data.phonePrefix + ' ' + logDetailDialog.data.mobile }}</el-tag>
        </el-form-item>

        <el-form-item label="短信类型">
          <el-tag type="success">{{logDetailDialog.data.smsType}}</el-tag>
        </el-form-item>

        <el-form-item label="短信厂商" >
          <el-tag type="success">{{logDetailDialog.data.manufacturerCode}}</el-tag>
        </el-form-item>

        <el-form-item label="状态">
          <el-tag v-if="logDetailDialog.data.success" type="success">成功</el-tag>
          <el-tag v-if="!logDetailDialog.data.success" type="danger">失败</el-tag>
        </el-form-item>

        <el-form-item label="请求时间">
          <el-tag><i class="el-icon-time" /><span style="margin-left: 5px">{{ logDetailDialog.data.sendTime }}</span></el-tag>
        </el-form-item>

        <el-form-item label="短信内容" style="white-space: pre-line;">
          {{ logDetailDialog.data.sendContent }}
        </el-form-item>

        <el-form-item label="返回状态码">
          <el-tag v-if="logDetailDialog.data.success" type="success">{{ logDetailDialog.data.statusCode }}</el-tag>
          <el-tag v-if="!logDetailDialog.data.success" type="danger">{{ logDetailDialog.data.statusCode }}</el-tag>
        </el-form-item>

        <el-form-item label="返回值" style="white-space: pre-line;">
          {{ logDetailDialog.data.resultContent }}
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSmsLogPageInfo
} from '@/api/logs/smsLog'

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
            mobile: null,
            success: null
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
      getSmsLogPageInfo(pagerRequest).then(resp => {
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
