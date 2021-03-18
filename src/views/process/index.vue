<template>
  <div class="mod-config">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        header-align="center"
        align="left"
        label="任务名称"
      ></el-table-column>
      <el-table-column
        prop="context"
        header-align="center"
        align="left"
        label="任务详情"
        width="280"
      >
        <template slot-scope="scope">
          <div v-html="scope.row.context" class="rich"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="backDevelopTime"
        header-align="center"
        align="center"
        label="后端开发完成时间"
        width="100"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.backDevelopTime | formaterDate }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="frontDevelopTime"
        header-align="center"
        align="center"
        label="前端开发完成时间"
        width="100"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.frontDevelopTime | formaterDate }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="jointDebugTime"
        header-align="center"
        align="center"
        label="联调时间"
        width="100"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.jointDebugTime | formaterDate }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="raiseTestTime"
        header-align="center"
        align="center"
        label="提测时间"
        width="100"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.raiseTestTime | formaterDate }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="preOnlineTime"
        header-align="center"
        align="center"
        label="预发时间"
        width="100"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.preOnlineTime | formaterDate }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="onlineTime"
        header-align="center"
        align="center"
        label="上线时间"
        width="100"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.onlineTime | formaterDate }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="backDevelop"
        header-align="center"
        align="left"
        label="后端开发人员"
      ></el-table-column>
      <el-table-column
        prop="backDevelopPm"
        header-align="center"
        align="left"
        label="后端负责人"
      ></el-table-column>
      <el-table-column
        prop="frontDevelop"
        header-align="center"
        align="left"
        label="前端开发人员"
      ></el-table-column>
      <el-table-column
        prop="frontDevelopPm"
        header-align="center"
        align="left"
        label="前端负责人"
      ></el-table-column>
      <el-table-column
        prop="testStaff"
        header-align="center"
        align="left"
        label="测试人员"
      ></el-table-column>
      <el-table-column
        prop="testStaffPm"
        header-align="center"
        align="left"
        label="测试负责人"
      ></el-table-column>
      <el-table-column
        prop="productStaff"
        header-align="center"
        align="left"
        label="产品"
      ></el-table-column>
      <el-table-column
        prop="otherStaff"
        header-align="center"
        align="left"
        label="其他人员"
      ></el-table-column>

      <el-table-column width="70" label="添加" align="center" fixed="right">
        <template slot="header">
          <el-button
            size="mini"
            style="margin-left: 0px"
            @click="handleAddOrUpdate()"
            >添加</el-button
          >
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            style="margin-left: 0px"
            @click="handleAddOrUpdate(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            style="margin-left: 0px"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
    <!-- 弹窗, 新增 / 修改 -->
  </div>
</template>
<script>
import { apiProcessList, apiHandleDelete } from '@/api/api_task'
import { formatDate } from '@/api/date.js'

import AddOrUpdate from './process-add-or-update.vue'

export default {
  filters: {
    formaterDate(val) {
      var date = new Date(val)

      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  data() {
    return {
      dataList: [],
      pageIndex: 1,
      addOrUpdateVisible: false,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      branchId: 1
    }
  },
  watch: {
    $route() {
      console.log(1223)
      this.getDataList()
    }
  },
  computed: {},
  components: {
    AddOrUpdate
  },
  created() {
    this.getDataList()
  },
  activated() {
    console.log(11)
  },
  methods: {
    // 获取数据列表
    getDataList() {
      var href = window.location.href
      if (href.indexOf('?')) {
        let hrefs = href.split('=')
        this.branchId = hrefs[1]
      }
      apiProcessList({
        menuId: this.branchId
      }).then(data => {
        if (data && data.code === 1000) {
          this.dataList = data.data.list
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      })
    },
    // 新增 / 编辑
    handleAddOrUpdate(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.addOrUpdate.init(id, this.branchId)
        }, 500)
      })
    },
    handleDelete(id) {
      apiHandleDelete({
        taskId: id
      }).then(data => {
        if (data && data.code === 1000) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.contentEdit {
  color: blue;
  cursor: pointer;
}

.btn-box {
  margin-bottom: 10px;
}

.formaterDateCss {
  cursor: pointer;
  color: blue;
}

.formaterDateCss :hover {
  text-decoration: underline;
}
</style>
