<template>
  <div class="port-list">
    <el-form :model="search" inline>
      <el-form-item label="接口名">
        <el-input size="small" v-model="search.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="onSearch">查询</el-button>
        <el-button type="danger" size="small" @click="saerch.name = ''"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-button size="small" type="primary" @click="onAdd">新增接口</el-button>
    <el-button size="small" type="success" @click="onAddPortToGroup"
      >添加接口到组</el-button
    >
    <el-table :data="data" ref="table" @selection-change="onSelectRow">
      <el-table-column type="selection"> </el-table-column>
      <el-table-column prop="name" label="接口名"> </el-table-column>
      <el-table-column prop="fileName" label="文件名称"> </el-table-column>
      <el-table-column prop="checked" label="已选">
        <template slot-scope="scope">
          <el-badge v-if="scope.row.nowGroupNum" :value="scope.row.nowGroupNum">
            <el-tag disable-transitions type="success" size="small"
              >已选</el-tag
            >
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column prop="groupRefreshNum" label="引用次数" align="center">
      </el-table-column>
      <el-table-column prop="realName" label="创建者"> </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="onEdit(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="onDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  apiGetPortList,
  apiModifyPory,
  apiGetPortInfo,
  apiAddPort,
  apiGetGroupPort
} from '@/api/port'
export default {
  data() {
    return {
      data: [],
      search: { name: '' }
    }
  },
  created() {
    this.curgroup = this.$route.query.curgroup
    this.menuId = this.$route.query.menuId
    this.selectList = []
    this.onGetPortList()
  },
  methods: {
    onSearch() {
      this.onGetPortList()
    },
    onGetPortList() {
      apiGetPortList({
        name: this.search.name || undefined,
        menuId: this.menuId
      }).then(res => {
        if (res.code === 1000) {
          const data = res.data
          this.initRowNum = {}
          apiGetGroupPort({ id: this.curgroup }).then(res => {
            if (res.code === 1000) {
              this.portIds = res.data.map(item => item.interfaceId)
              if (this.portIds.length) {
                data.forEach(row => {
                  const num = this.portIds.reduce((data, current) => {
                    return data + Number(current === row.id)
                  }, 0)
                  this.initRowNum[row.id] = num
                  row.nowGroupNum = num
                })
              }
              this.data = data
            } else {
              this.data = data
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onAdd() {
      this.$router.push({ name: 'addPort', query: { menuId: this.menuId } })
    },
    onEdit(row) {
      apiGetPortInfo({ id: row.id }).then(res => {
        if (res.code === 1000) {
          localStorage.setItem('pythonEdit', res.data.code)
          this.$router.push({
            path: `/pyeditor/edit/${row.id}`,
            query: {
              data: JSON.stringify({
                name: res.data.name,
                fileName: res.data.fileName,
                menuId: this.menuId
              })
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onDelete(row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          apiModifyPory({ id: row.id, isDelete: 1 }).then(res => {
            if (res.code === 1000) {
              this.$message({ type: 'success', message: '删除成功!' })
              this.onGetPortList()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch()
    },
    onSelectRow(row) {
      this.selectList = row
      this.data.forEach(item => {
        if (row.find(child => child.id === item.id)) {
          item.nowGroupNum = Number(this.initRowNum[item.id]) + 1
        } else {
          item.nowGroupNum = this.initRowNum[item.id]
        }
      })
    },
    onAddPortToGroup() {
      if (!this.curgroup) {
        return this.$message.error('请先添加组再添加接口')
      }
      if (this.selectList.length) {
        const ids = this.selectList.map(item => item.id)
        apiAddPort({ id: this.curgroup, interfaceIds: ids.join() }).then(
          res => {
            if (res.code === 1000) {
              this.$message({ type: 'success', message: '操作成功' })
              setTimeout(() => {
                this.$router.go(-1)
              }, 500)
            } else {
              this.$message.error(res.msg)
            }
          }
        )
      }
    }
  }
}
</script>

<style lang="less">
.port-list {
  padding: 10px 20px;
  & > .el-button {
    margin-top: -10px;
    margin-bottom: 16px;
  }
  .el-table__header-wrapper th {
    background: #f8f8f9;
  }
  .el-table td {
    padding: 8px 0;
  }
  .el-table .cell {
    overflow: initial;
  }
  .el-badge__content {
    transform: translateY(-50%) translateX(100%) scale(0.8);
  }
}
</style>
