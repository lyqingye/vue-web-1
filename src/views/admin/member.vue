<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部栏 用于放置其它控件-->
      <el-header ref="header" style="height: auto;">
        <el-form :inline="true">
          <el-form-item label="手机号">
            <el-input v-model="table.pageQuery.data.mobile" placeholder="可选" />
          </el-form-item>

          <el-form-item label="是否冻结">
            <el-select v-model="table.pageQuery.data.isFrozen" placeholder="可选">
              <el-option label="正常" value="false" />
              <el-option label="冻结" value="true" />
            </el-select>
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

          <el-table-column label="手机号" width="150" align="center">
            <template slot-scope="scope">
              <el-tag type="info">{{ scope.row.mobile }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="邀请码" width="200" align="center">
            <template slot-scope="scope">
              <el-tag type="info">{{ scope.row.inviteCode }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isFrozen" type="danger">冻结</el-tag>
              <el-tag v-if="!scope.row.isFrozen" type="success">正常</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" width="250" align="center">
            <template slot-scope="scope">
              <el-tag>
                <i class="el-icon-time" />
                <span style="margin-left: 5px">{{ scope.row.createTime }}</span>
              </el-tag>
            </template>
          </el-table-column>

          <!-- <el-table-column label="操作" >
            <template slot-scope="scope" />
          </el-table-column> -->
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
  getMemberPageInfo
} from '@/api/admin/member'

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
            isFrozen: null
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
      getMemberPageInfo(pagerRequest).then(resp => {
        this.table.pageInfo = resp.data
        this.table.loading = false
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
