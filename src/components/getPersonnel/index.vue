/** * 组件名称 * @desc 获取公司人员的组件 * @title 组件的标题 * @value 绑定 form
表单的字段 * @isShow 控制组件的显示隐藏 * @showDataList 确认按钮后的数据更新 *
@cb 确认后的回调 添加@cb 后 动态绑定 showDataList 不会进行更新 * @example
调用示例 *
<getPersonnel
  v-if="isSshowOutIds"
  :value.sync="form.outIds"
  :isShow.sync="isSshowOutIds"
  :showDataList.sync="outIdsLsit"
/>
*
<getPersonnel
  @cb="handleCheckStaffIds"
  v-if="isShowPersonnel"
  :value.sync="form.staffIds"
  :isShow.sync="isShowPersonnel"
  :showDataList.sync="personnelList"
/>
*/
<template>
  <div>
    <el-dialog
      :title="title"
      append-to-body
      :visible.sync="show"
      @close="close"
      width="800px"
      center
    >
      <div class="popup">
        <div class="popup-item boderAndRadius">
          <div class="popup-item-title">
            <span
              v-for="(i, index) in titleList"
              style="cursor: pointer"
              :key="i.departmentId"
              :class="{ isActiveTitle: index + 1 < titleList.length }"
              @click="handleChangeTtitle(i)"
            >
              {{ i.departmentName }}
              <span v-if="index + 1 < titleList.length">></span>
            </span>
          </div>
          <div class="popup-item-content">
            <div class="popup-item-content-item">
              <div class="content">
                <el-checkbox :value="isAll" @change="handleChangChoose($event)"
                  >全选</el-checkbox
                >
              </div>
            </div>
            <div
              v-for="i in showData"
              :key="i.departmentId"
              class="popup-item-content-item borderItem"
            >
              <div class="content">
                <el-checkbox
                  :value="handleCheck(i)"
                  @change="handleChangChoose($event, i)"
                  >{{ i.departmentName }}</el-checkbox
                >
              </div>
              <div
                class="popup-item-content-item-next"
                :class="{
                  isHasActive: handleCheck(i) || (!i.list && !i.staffDtos)
                }"
                @click="handleNext(i)"
              >
                下级
              </div>
            </div>
            <div
              class="popup-item-content-item borderItem"
              v-for="i in staffDtos"
              :key="i.staffId"
              @click="handleChangChooseRenyuan(i)"
            >
              <div class="popup-item-content-item-img">
                <img src="@/assets/workbench/touxinag.jpg" alt="" />
                <i v-if="handleCheck(i)" class="el-icon-check"></i>
              </div>
              <div>{{ i.name }}</div>
            </div>
          </div>
        </div>
        <div class="popup-item boderAndRadius">
          <div class="popup-item-right">
            <el-tag
              v-for="tag in tags"
              :key="tag.departmentName"
              @close="handleClose(tag)"
              closable
            >
              {{ tag.departmentName || tag.name }}
            </el-tag>
            <div class="commonFont noChoose" v-if="tags.length === 0">
              暂无选择
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancel">取 消</el-button>
        <el-button size="mini" @click="tags = []">清空全部</el-button>
        <el-button size="mini" type="primary" @click="centerDialogVisible"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    deplist: {
      type: Array
    },
    len: {
      type: Number,
      default: 99999
    },
    isShow: {
      TYPE: Boolean,
      default: () => false
    },
    showDataList: {
      type: Object,
      default: () => {
        return {
          list: [],
          title: {}
        }
      }
    },
    title: {
      type: String,
      default: '选择人员'
    }
  },
  data() {
    return {
      show: true,
      checked: false,
      data: [],
      showData: [],
      checkList: [],
      titleList: [
        {
          departmentId: 0,
          departmentName: '全部'
        }
      ],
      tags: [],
      staffDtos: []
    }
  },
  computed: {
    isAll() {
      return (
        this.staffDtos.every(i =>
          this.tags.some(j => i.departmentId === j.departmentId)
        ) &&
        this.showData.every(i =>
          this.tags.some(j => i.departmentId === j.departmentId)
        )
      )
    }
  },
  beforeMount() {},
  mounted() {
    this.data = this.deplist
    this.tags = this.showDataList.list.concat([]) || []
    this.showData = this.data.length > -1 ? this.data : []
  },
  methods: {
    // 点击title切换层级
    handleChangeTtitle(item) {
      if (item.staffDtos) {
        this.staffDtos = item.staffDtos.map(i => {
          i.departmentId = i.staffId + '-id'
          i.departmentName = i.name
          return i
        })
      } else {
        this.staffDtos = []
      }
      if (item.departmentId === 0) {
        this.showData = this.data.length > -1 ? this.data : []
        this.titleList = [
          {
            departmentId: 0,
            departmentName: '全部'
          }
        ]
        return
      }
      let arr = []
      for (let i in this.titleList) {
        arr.push(this.titleList[i])
        if (item.departmentId === this.titleList[i].departmentId) break
      }
      this.titleList = arr
      this.showData = item.list || []
    },
    // 是否勾选
    handleCheck(item) {
      return this.tags.some(i => i.departmentId === item.departmentId)
    },
    handleChangChooseRenyuan(item) {
      const isHas = this.tags.some(i => i.departmentId === item.departmentId)
      if (isHas) {
        this.tags = this.tags.filter(i => i.departmentId !== item.departmentId)
      }
      if (!isHas) {
        this.tags.push(item)
      }
    },
    handleChangChoose(event, item) {
      if (!item) {
        if (event) {
          this.showData.map(i => {
            if (!this.tags.some(j => i.departmentId === j.departmentId))
              this.tags.push(i)
          })
          this.staffDtos.map(i => {
            if (!this.tags.some(j => i.departmentId === j.departmentId))
              this.tags.push(i)
          })
        } else {
          this.tags = this.tags.filter(
            i => !this.staffDtos.some(j => j.departmentId === i.departmentId)
          )
          this.tags = this.tags.filter(
            i => !this.showData.some(j => j.departmentId === i.departmentId)
          )
        }
        return
      }
      const isHas = this.tags.some(i => i.departmentId === item.departmentId)
      if (isHas && !event) {
        this.tags = this.tags.filter(i => i.departmentId !== item.departmentId)
      }
      if (!isHas && event) {
        this.tags.push(item)
      }
    },
    handleClick() {},
    // 点击下级
    handleNext(item) {
      if (item.staffDtos) {
        this.staffDtos = item.staffDtos.map(i => {
          i.departmentId = i.staffId + '-id'
          i.departmentName = i.name
          return i
        })
      } else {
        this.staffDtos = []
      }
      this.showData = item.list || []
      // if (this.handleCheck(item) || !item.list) return
      this.titleList.push(item)
      this.handleGetNextChildren()
    },
    // 删除右侧标签
    handleClose(item) {
      if (item.staffId) {
        this.tags = this.tags.filter(i => i.staffId !== item.staffId)
        return
      }
      this.tags = this.tags.filter(i => i.departmentId !== item.departmentId)
      // this.$forceUpdate()
    },
    // 关闭弹窗
    close() {
      this.show = true
      this.$emit('update:isShow', false)
      // this.$forceUpdate()
    },
    personlGetForm(arr) {
      const params = {
        list: [],
        title: '',
        value: ''
      }
      if (!arr || arr.length === 0) return params
      if (!arr[0].staffId) {
        arr = arr.map(i => {
          i.staffId = i.id
          return i
        })
      }
      const key = 'staffId'
      arr = arr.sort((a, b) => a[key] - b[key])
      params.list = arr
      for (let i in arr) {
        // 将数组的 id 进行拼接成后端所需格式,通过对象返回
        if (i < 1) {
          params.title = params.title + (i === '0' ? '' : ',') + arr[i].name
        }
        params.value += arr[i][key] + (i < arr.length - 1 ? ',' : '')
      }
      return params
    },
    // 关闭弹窗
    centerDialogVisible() {
      let arr = this.handleGetPerson(this.tags)
      let obj = {}
      arr = arr.reduce((item, next) => {
        if (!obj[next.staffId]) {
          obj[next.staffId] = true
          item.push(next)
        }
        return item
      }, [])
      if (this.len < arr.length) {
        this.$message.info('人数最多只能选择' + this.len + '人')
        return
      }
      const params = this.personlGetForm(arr)
      if (this.$listeners.cb) {
        this.$emit('cb', params)
      } else {
        this.$emit('update:value', params.value)
        this.$emit('update:showDataList', params)
        this.$emit('update:isShow', false)
      }
    },
    handleGetPerson(list = this.tags, getList = []) {
      list.map(i => {
        if (i.staffId) getList.push(i)
        if (i.staffDtos) getList = getList.concat(i.staffDtos)
        if (i.list)
          getList = getList.concat(this.handleGetPerson(i.list, getList))
      })
      return getList
    },
    handleGetNextChildren() {},
    handleCancel() {
      this.$emit('update:isShow', false)
      this.$forceUpdate()
    }
  },
  watch: {}
}
</script>
<style lang="less" scoped>
.noChoose {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup {
  min-height: 100px;
  display: flex;
  justify-content: space-between;
  &-item {
    width: 48%;
    box-sizing: border-box;
    overflow: auto;
    padding: 10px 0;
    &-right {
      padding: 10px !important;
      height: 500px;
      box-sizing: border-box;
      overflow: auto;
      .el-tag {
        margin: 5px 6px;
      }
    }
    .isActiveTitle {
      color: #3ba1ff;
    }
    &-title {
      color: #9b9b9b;
      padding-bottom: 4px;
      border-bottom: 1px solid #ebebeb;
      padding: 10px;
    }
    &-content {
      height: 400px;
      overflow: auto;
      .borderItem {
        border-top: 1px solid #ebebeb;
      }
      &-item:nth-last-child(1) {
        border-bottom: 1px solid #ebebeb;
      }
      &-item {
        &-img {
          margin: 0 10px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          i {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            z-index: 10;
            font-size: 26px;
            color: #3ba1ff;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .isHasActive {
          color: rgba(196, 196, 196, 0.933) !important;
          border-left: 1px solid rgba(196, 196, 196, 0.933) !important;
        }
        .content {
          flex: 1;
          padding: 0 10px;
          height: 100%;
        }
        .content:hover {
          background: rgb(238, 238, 238);
        }
        &-next {
          padding: 0 10px;
          border-left: 1px solid #3ba1ff;
          color: #3ba1ff;
          height: 20px;
          cursor: pointer;
        }
        .el-checkbox {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
<style lang="less">
.el-dialog {
  border-radius: 6px;
}
.el-dialog__header {
  border-bottom: 1px solid #ebebeb;
}
.el-dialog__footer {
  border-top: 1px solid #ebebeb;
}
.el-dialog__title {
  font-size: 14px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
