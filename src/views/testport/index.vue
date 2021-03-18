<template>
  <div class="test-ports">
    <el-row :gutter="15">
      <el-col :span="9">
        <card
          ref="card"
          sign="groups"
          :title="groups.title"
          :tableData="groups.data"
          :column="groups.column"
          :loadinglist="resultIds"
          :testIds="tmpTestIds"
          @testAll="onTestAll"
          @add="onAdd"
          @edit="onEdit"
          @currentChange="onCurrentChange"
          @changeStatus="onchangeStatus"
          @delete="onSignleDelete"
          @changeSort="onChangeSort"
          @changeSelect="onChangeSelect"
          @signleTest="onSignleTest"
        ></card>
      </el-col>
      <el-col :span="15">
        <card
          ref="card2"
          sign="ports"
          :title="ports.title"
          :tableData="ports.data"
          :column="ports.column"
          :loadinglist="resultIds[curgroup] || []"
          :testIds="tmpTestIds[curgroup] || []"
          @testAll="onTestAll"
          @add="onAdd"
          @edit="onEdit"
          @changeStatus="onchangeStatus"
          @delete="onSignleDelete"
          @changeSort="onChangeSort"
          @changeSelect="onChangeSelect"
          @signleTest="onSignleTest"
        ></card>
      </el-col>
    </el-row>
    <el-dialog
      width="550px"
      :title="groups.edit ? '编辑' : '新建' + '组'"
      :visible.sync="groups.showDialog"
    >
      <el-form
        ref="groupsDialog"
        :model="groups.dialogData"
        label-width="80px"
        :rules="groups.rules"
      >
        <el-form-item label="组名" prop="name">
          <el-input size="small" v-model="groups.dialogData.name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="groups.dialogData.status"
            active-text="启用"
            inactive-text="禁用"
            :active-value="0"
            :inactive-value="1"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="groups.showDialog = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="onGroupSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  apiGetGroupList,
  apiModifyGroup,
  apiGetGroupInfo,
  apiGetGroupPort,
  apiGetPortInfo,
  apiModifyGroupPort,
  apiTestGroup,
  apiGetPortResult,
  apiTestPort
} from '@/api/port'
import card from './card'
export default {
  components: { card },
  data() {
    return {
      testIds: {},
      tmpTestIds: {},
      resultIds: {},
      curgroup: NaN,
      groups: {
        title: '项目1',
        edit: 0,
        data: [],
        // data: [{ name: '组名1', status: 1 }, { name: '组名2', status: 0 }, { name: '组名3', status: 1 }, { name: '组名1', status: 1 }, { name: '组名2', status: 0 }, { name: '组名3', status: 1 }],
        column: [
          { label: '组名', prop: 'name', minWidth: 120 },
          {
            label: '状态',
            prop: 'status',
            minWidth: 50,
            formatter: row => (row.status ? '禁用' : '启用')
          },
          { label: '操作', align: 'right', width: 130 }
        ],
        dialogData: {},
        showDialog: false,
        selections: [],
        rules: {
          name: [{ required: true, message: '请输入组名', trigger: 'blur' }],
          status: [{ required: true, message: '', trigger: 'blur' }]
        }
      },
      ports: {
        title: '组名1',
        // data: [{ name: '接口1', status: 1 }, { name: '接口2', status: 0 }, { name: '接口3', status: 1 }, { name: '组名1', status: 1 }, { name: '组名2', status: 0 }, { name: '组名3', status: 1 }],
        groupId: '',
        data: [],
        selections: [],
        column: [
          { label: '接口名', prop: 'name', minWidth: 300 },
          {
            label: '状态',
            prop: 'status',
            minWidth: 50,
            formatter: row => (row.status ? '禁用' : '启用')
          },
          { label: '操作', align: 'right', width: 130 }
        ]
      }
    }
  },
  created() {
    this.menuId = this.$route.query.id
    this.onGetGroupList(true)
  },
  watch: {
    // curgroup(id) {
    //   console.log(222, this.testIds[id]);
    //   if (Array.isArray(this.testIds[id])) {
    //     setTimeout(() => {
    //       this.$refs.card2.$refs.table.toggleAllSelection()
    //     }, 500)
    //   }
    // }
  },
  methods: {
    onGetGroupList(init) {
      apiGetGroupList({ menuId: this.menuId }).then(res => {
        if (res.code === 1000) {
          this.groups.data = []
          this.$nextTick(() => {
            this.groups.data = res.data.map(item => ({
              name: item.name,
              status: item.isDisable,
              id: item.id,
              position: item.position
            }))
            this.onGetGroupPort(init ? this.groups.data[0] : this.curGroupRow)
            let tmpGroupRow = this.groups.data[0]
            if (!init) {
              tmpGroupRow = this.groups.data.find(
                item => item.id === this.curGroupRow.id
              )
            }
            this.$refs.card.$refs.table.setCurrentRow(tmpGroupRow)
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onGetGroupPort(data) {
      if (data) {
        this.ports.title = data.name
        this.curgroup = data.id
        this.curGroupRow = data
        apiGetGroupPort({ id: data.id }).then(res => {
          if (res.code === 1000) {
            this.ports.groupId = this.curgroup
            this.ports.data = res.data.map(item => ({
              name: item.name,
              status: item.isDisable,
              id: item.id,
              interfaceId: item.interfaceId,
              position: item.position
            }))
            this.ports.data.forEach(row => {
              const tmp = this.testIds[this.curgroup]
              if (
                Array.isArray(tmp) ||
                (typeof tmp === 'string' &&
                  tmp.split(',').includes(String(row.id)))
              ) {
                setTimeout(() => {
                  this.$refs.card2.$refs.table.toggleRowSelection(row, true)
                }, 100)
              }
            })
            let cacheCurGroupId = ''
            if ((cacheCurGroupId = sessionStorage.getItem('curgroup'))) {
              const row = this.groups.data.find(
                item => item.id === Number(cacheCurGroupId)
              )
              sessionStorage.removeItem('curgroup')
              this.$refs.card.$refs.table.setCurrentRow(row)
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.ports.title = ''
        this.curgroup = NaN
        this.ports.data = []
      }
    },
    onEdit(row) {
      if (row.type === 'groups') {
        this.groups.edit = 1
        apiGetGroupInfo({ menuId: this.menuId, id: row.id }).then(res => {
          if (res.code === 1000) {
            const data = res.data
            this.groups.dialogData = {
              name: data.name,
              status: data.isDisable,
              id: row.id
            }
            this.groups.showDialog = true
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        apiGetPortInfo({ id: row.interfaceId }).then(res => {
          if (res.code === 1000) {
            localStorage.setItem('pythonEdit', res.data.code)
            this.$router.push({
              path: `/pyeditor/edit/${row.interfaceId}`,
              query: {
                data: JSON.stringify({
                  name: res.data.name,
                  fileName: res.data.fileName
                })
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    onCurrentChange(row) {
      this.onGetGroupPort(row)
    },
    onchangeStatus(row) {
      let api = apiModifyGroup
      if (row.type === 'ports') {
        api = apiModifyGroupPort
      }
      api({ menuId: this.menuId, id: row.id, isDisable: row.status }).then(
        res => {
          if (res.code === 1000) {
            this.$message({ type: 'success', message: '操作成功!' })
            this.onGetGroupList()
          } else {
            this.$message.error(res.msg)
          }
        }
      )
    },
    onSignleDelete(row) {
      let api = apiModifyGroup
      let msg = '组'
      if (row.type === 'ports') {
        api = apiModifyGroupPort
        msg = '接口'
      }
      this.$confirm(`是否确认删除${msg}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api({ menuId: this.menuId, id: row.id, isDelete: 1 }).then(res => {
            if (res.code === 1000) {
              this.$message({ type: 'success', message: '删除成功!' })
              this.onGetGroupList()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(() => {})
    },
    onGroupSubmit() {
      this.$refs.groupsDialog.validate(valid => {
        if (valid) {
          const dialog = this.groups.dialogData
          apiModifyGroup({
            menuId: this.menuId,
            id: dialog.id,
            isDisable: dialog.status,
            name: dialog.name
          }).then(res => {
            if (res.code === 1000) {
              this.groups.showDialog = false
              this.$message({ type: 'success', message: '操作成功' })
              this.onGetGroupList()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    onTestAll() {
      this.resultIds = {}
      const testIds = Object.keys(this.testIds).reduce((data, id) => {
        return (
          this.testIds[id] ? this.testIds[id] : '',
          `${data}&${id}:${this.testIds[id] ? this.testIds[id] : ''}`
        )
      }, '')
      apiTestGroup({ testIds: testIds.slice(1), menuId: this.menuId }).then(
        res => {
          if (res.code === 1000) {
            this.tmpTestIds = this.testIds
            this.onGetResult(res.data.uniqueId)
          } else {
            this.$message.error(res.msg)
          }
        }
      )
    },
    onSignleTest(val) {
      this.resultIds = {}
      if (val.type === 'groups') {
        let id = val.val.id
        id += ':' + (this.testIds[id] || '')
        console.log(id)
        apiTestGroup({ testIds: id, menuId: this.menuId }).then(res => {
          if (res.code === 1000) {
            this.tmpTestIds = this.testIds
            this.onGetResult(res.data.uniqueId)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        apiTestPort({ id: val.val.id }).then(res => {
          if (res.code === 1000) {
            this.$message({ type: 'success', message: '测试成功' })
            const result = res.data.reduce((total, item) => {
              return (total += `<p style="color: ${item.color}">${item.content}</p>`)
            }, '')
            this.$set(this.resultIds, this.curgroup, {
              [val.val.id]: { result: result }
            })
          } else {
            this.$message.error(res.msg)
            const result = res.data.reduce((total, item) => {
              return (total += `<p style="color: ${item.color}">${item.content}</p>`)
            }, '')
            this.$set(this.resultIds, this.curgroup, {
              [val.val.id]: { result: result }
            })
          }
        })
      }
    },
    onGetResult(uniqueId) {
      this.timer = setTimeout(() => {
        apiGetPortResult({ uniqueId }).then(res => {
          clearTimeout(this.timer)
          if (res.code === 1000) {
            res.data.list.forEach(item => {
              if (!this.resultIds[item.groupId]) {
                this.$set(this.resultIds, item.groupId, {})
              }
              this.$set(this.resultIds[item.groupId], item.groupInterfaceId, {
                status: item.status,
                result: item.exeResult
              })
            })
            if (res.data.flag !== 1) {
              this.onGetResult(uniqueId)
            } else {
              Object.keys(this.tmpTestIds).forEach(groupId => {
                if (!this.resultIds[groupId]) {
                  this.$set(this.resultIds, groupId, {})
                }
                if (this.tmpTestIds[groupId]) {
                  this.tmpTestIds[groupId].split(',').forEach(id => {
                    if (!this.resultIds[groupId][id]) {
                      this.$set(this.resultIds[groupId], id, {
                        status: 3,
                        result: ''
                      })
                    }
                  })
                }
              })
              this.resultIds.last = {}
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      }, 1000)
    },
    onAdd(type) {
      if (type === 'groups') {
        this.groups.edit = 0
        this.groups.dialogData = { status: 0, name: '' }
        this.groups.showDialog = true
      } else {
        sessionStorage.setItem('curgroup', this.curgroup)
        this.$router.push({
          name: 'port',
          query: { menuId: this.menuId, curgroup: this.curgroup }
        })
      }
    },
    onChangeSort(val) {
      const api = val.type === 'groups' ? apiModifyGroup : apiModifyGroupPort
      const data = this[val.type].data
      const { oldIndex, newIndex } = val.val
      if (oldIndex !== newIndex) {
        api({
          menuId: this.menuId,
          id: data[oldIndex].id,
          position: data[newIndex].position
        }).then(res => {
          if (res.code === 1000) {
            this.onGetGroupList()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    onChangeSelect(val) {
      this[val.type].selections = val.val
      if (val.type === 'ports') {
        if (val.val.length) {
          this.testIds[this.curgroup] = val.val.map(item => item.id).join()
          const classname =
            val.val.length === this.ports.data.length
              ? 'el-checkbox__input is-checked'
              : 'el-checkbox__input is-indeterminate'
          this.$set(this.curGroupRow, 'checked', true)
          this.$nextTick(() => {
            document.querySelector(
              `.row-checked-${this.curGroupRow.id} .el-checkbox__input`
            ) &&
              document
                .querySelector(
                  `.row-checked-${this.curGroupRow.id} .el-checkbox__input`
                )
                .setAttribute('class', classname)
          })
        } else {
          delete this.testIds[this.curgroup]
          this.$nextTick(() => {
            document.querySelector(
              `.row-checked-${this.curGroupRow.id} .el-checkbox__input`
            ) &&
              document
                .querySelector(
                  `.row-checked-${this.curGroupRow.id} .el-checkbox__input`
                )
                .setAttribute('class', 'el-checkbox__input')
          })
        }
      } else {
        Object.keys(this.testIds).forEach(id => {
          if (!val.val.find(item => item.id === Number(id))) {
            this.testIds[id] = undefined
            if (this.curgroup === this.ports.groupId) {
              this.$refs.card2.$refs.table.clearSelection()
            }
          }
        })
        val.val.forEach(item => {
          if (!this.testIds[item.id]) {
            if (this.curgroup === this.ports.groupId) {
              this.$refs.card2.$refs.table.toggleAllSelection()
            }
          }
          this.testIds[item.id] = []
        })
      }
    }
  }
}
</script>

<style lang="less">
.test-ports {
  padding: 20px;
  .el-dialog__body {
    padding: 20px 20px 0px;
  }
}
</style>
