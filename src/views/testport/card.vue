<template>
  <el-card :class="['port-card', sign]">
    <div slot="header" class="clearfix">
      <label
        v-if="sign === 'groups'"
        :class="['el-el-checkbox', { 'is-checked': checkedAll }]"
        style="margin-right: 10px"
        @click="onChangeAllChecked"
      >
        <span :class="['el-checkbox__input', { 'is-checked': checkedAll }]">
          <span class="el-checkbox__inner"></span>
          <input
            type="checkbox"
            aria-hidden="false"
            class="el-checkbox__original"
            value=""
          />
        </span>
      </label>
      <span>{{ `${title}（${chinese}列表）` }}</span>
      <el-button v-if="sign === 'groups'" type="text" @click="onTestAll"
        >测试{{ chinese }}</el-button
      >
      <el-button type="text" @click="onAdd">添加{{ chinese }}</el-button>
    </div>
    <el-table
      ref="table"
      highlight-current-row
      :show-header="false"
      size="small"
      :default-sort="{ prop: 'sortNum', order: 'ascending' }"
      :data="tableData"
      align="left"
      :row-class-name="onRowClass"
      @select="onSelect"
      @selection-change="onSelectionChange"
      @current-change="onCurrentChange"
    >
      <el-table-column
        type="selection"
        align="center"
        min-width="20"
        width="30"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="(item, index) in column"
        :key="`col_${index}`"
        :class-name="index === 0 ? 'title' : ''"
        v-bind="item"
      >
        <template slot-scope="scope">
          <i
            v-if="['接口名', '组名'].includes(item.label)"
            :class="showPortLoadingCls(scope.row)"
            style="margin-right: 10px"
          ></i>
          <el-tag
            v-if="item.label === '状态'"
            :type="scope.row.status === 1 ? 'danger' : 'success'"
            size="mini"
            disable-transitions
          >
            {{
              item.formatter ? item.formatter(scope.row) : scope.row[item.prop]
            }}
          </el-tag>
          <p v-else-if="item.label === '操作'">
            <el-button
              size="small"
              type="text"
              style="color: #67c23a"
              @click="onSignleTest(scope.row, $event)"
              >测试</el-button
            >
            <el-button
              size="small"
              type="text"
              @click="onEdit(scope.row, $event)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="text"
              style="color: #e6a23c"
              @click="onChangeStatus(scope.row, $event)"
              >{{ scope.row.status ? '启用' : '禁用' }}</el-button
            >
            <el-button
              size="small"
              type="text"
              style="color: #f56c6c"
              @click="onDelete(scope.row, $event)"
              >删除</el-button
            >
          </p>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="30">
        <template slot-scope="scope">
          <div class="result-code" v-html="showResult(scope.row)"></div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  props: {
    loadinglist: [Object, Array, String],
    testIds: [Object, Array, String],
    sign: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    column: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      checkedAll: false
    }
  },
  computed: {
    chinese() {
      return this.sign === 'groups' ? '组' : '接口'
    }
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    showPortLoadingCls(row) {
      let result = 'port-title '
      if (this.sign === 'groups') {
        const checkedIds = Object.keys(this.testIds)
        const tmp = Object.keys(this.loadinglist)
        if (!checkedIds.includes(String(row.id))) {
          return
        }
        const index = tmp.indexOf(String(row.id))
        if (index > -1) {
          if (
            index + 1 < tmp.length &&
            Object.values(this.loadinglist[row.id]).every(
              item => item.status !== 3
            )
          ) {
            result += 'el-icon-success'
          } else {
            result += 'el-icon-error'
          }
        } else {
          result += 'el-icon-loading'
        }
      } else {
        const tmp = this.loadinglist
        if (!this.testIds.includes(String(row.id))) {
          return
        }
        if (tmp[row.id]) {
          result +=
            tmp[row.id].status === 3 ? 'el-icon-error' : 'el-icon-success'
        } else {
          result += 'el-icon-loading'
        }
      }
      return result
    },
    rowDrop() {
      const tbody = document.querySelector(
        `.port-card.${this.sign} .el-table__body-wrapper tbody`
      )
      Sortable.create(tbody, {
        handle: '.allow-drag',
        onEnd: this.onChangeSort
      })
    },
    onTestAll() {
      this.$emit('testAll', this.sign)
    },
    onAdd() {
      this.$emit('add', this.sign)
    },
    onCurrentChange(row) {
      if (this.$listeners.currentChange) {
        this.$emit('currentChange', row)
      }
    },
    onSignleTest(row) {
      this.$emit('signleTest', { type: this.sign, val: row })
    },
    onEdit(row, e) {
      e.stopPropagation()
      this.$emit('edit', {
        id: row.id,
        status: row.status,
        type: this.sign,
        name: row.name,
        interfaceId: row.interfaceId
      })
    },
    onChangeStatus(row, e) {
      e.stopPropagation()
      this.$emit('changeStatus', {
        id: row.id,
        status: Number(!row.status),
        type: this.sign
      })
    },
    onDelete(row, e) {
      e.stopPropagation()
      this.$emit('delete', { id: row.id, type: this.sign })
    },
    onSelect(selection, row) {
      this.$refs.table.setCurrentRow(row)
    },
    onSelectionChange(val) {
      this.$emit('changeSelect', { type: this.sign, val })
    },
    onChangeSort(val) {
      this.$emit('changeSort', { type: this.sign, val })
    },
    onRowClass(row) {
      let result = 'allow-drag '
      result +=
        row.row.checked &&
        `row-checked-${
          this.sign === 'groups' ? row.row.id : row.row.interfaceId
        }`
      return result
    },
    jsonToHtml(val) {
      if (!val || !val.result) return '<p></p>'
      try {
        return JSON.parse(val.result).reduce((total, item) => {
          return (total += `<p style="color: ${item.color}">${item.content}</p>`)
        }, '')
      } catch (e) {
        return val.result
      }
    },
    showResult(row) {
      let result = ''
      if (this.sign === 'groups') {
        if (this.loadinglist[row.id]) {
          Object.keys(this.loadinglist[row.id]).forEach(id => {
            result += this.jsonToHtml(this.loadinglist[row.id][id])
          })
          return result
        }
        const tmp = Object.keys(this.loadinglist)
        if (tmp.includes(String(row.id))) {
          return result
        }
      } else {
        if (this.loadinglist[row.id]) {
          result = this.jsonToHtml(this.loadinglist[row.id])
          return result
        }
      }
    },
    onChangeAllChecked: (function () {
      let num = 0
      return function () {
        num++
        num % 2 && (this.checkedAll = !this.checkedAll)
        this.$refs.table.toggleAllSelection()
      }
    })()
  }
}
</script>

<style lang="less">
.port-card {
  .el-card__header {
    padding: 14px 15px 7px 8px;
    min-height: 40px;
    .el-button {
      float: right;
      padding: 3px 0;
      margin-left: 10px;
      color: #67c23a;
      & + .el-button {
        color: #409eff;
      }
    }
  }
  .el-card__body {
    padding: 0;
  }
  .el-table--small td,
  .el-table--small th {
    padding: 4px 0;
  }
  .el-table__row {
    max-height: 50px;
  }
  .el-table .cell {
    padding-right: 0;
  }
  .el-table__expand-column {
    .cell {
      padding-left: 0;
      padding-right: 10px;
    }
  }
  .el-button + .el-button {
    margin-left: 5px;
  }
  .port-title {
    font-size: 14px;
    &.el-icon-success {
      color: #67c23a;
    }
    &.el-icon-error {
      color: red;
    }
  }
  .result-code {
    padding: 0 10px;
    line-height: 16px;
    font-size: 12px;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .el-table-column--selection .cell {
    padding-left: 0px;
  }
  .el-table__row td.title .cell {
    padding-left: 0;
  }
}
</style>
