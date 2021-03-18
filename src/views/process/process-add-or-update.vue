<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="80px"
    >
      <el-form-item label="任务名称" prop="target">
        <el-input placeholder="任务名称" v-model="dataForm.name"></el-input>
      </el-form-item>

      <el-form-item label="任务内容" prop="context" property="context">
        <div id="contextEditorElem" class="editor"></div>
      </el-form-item>

      <el-form-item
        label="后端开发完成时间"
        prop="context"
        property="backDevelopTime"
      >
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="dataForm.backDevelopTime"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <el-form-item
        label="前端开发完成时间"
        prop="context"
        property="frontDevelopTime"
      >
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="dataForm.frontDevelopTime"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="联调时间" prop="context" property="jointDebugTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="dataForm.jointDebugTime"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="提测时间" prop="context" property="raiseTestTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="dataForm.raiseTestTime"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="预发时间" prop="context" property="preOnlineTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="dataForm.preOnlineTime"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="上线时间" prop="context" property="onlineTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="dataForm.onlineTime"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <el-form-item
        label="后端开发人员"
        prop="backDevelopList"
        :showClose="false"
      >
        <div
          v-if="dataForm.backDevelopList.length > 0"
          class="pinglun-bottom-content top"
        >
          <div v-if="dataForm.backDevelopList.length > 0">
            <el-tag
              size="mini"
              style="margin: 2px 4px"
              v-for="tag in dataForm.backDevelopList"
              :key="tag.staffId"
              @close="backDevelopListCloseItem(tag)"
              closable
            >
              {{ tag.realName }}
            </el-tag>
          </div>
          <i @click="dataForm.backDevelopList = []" style="font-size: 20px">
          </i>
        </div>
        <span class="at" @click="handleAtSomeOne.call(this, 'backDevelopList')"
          >@</span
        >
      </el-form-item>

      <el-form-item label="后端负责人" prop="backDevelopPmList">
        <div
          v-if="dataForm.backDevelopPmList.length > 0"
          class="pinglun-bottom-content top"
        >
          <div v-if="dataForm.backDevelopPmList.length > 0">
            <el-tag
              size="mini"
              style="margin: 2px 4px"
              v-for="tag in dataForm.backDevelopPmList"
              :key="tag.staffId"
              @close="backDevelopPmListCloseItem(tag)"
              closable
            >
              {{ tag.realName }}
            </el-tag>
          </div>
          <i @click="dataForm.backDevelopPmList = []" style="font-size: 20px">
          </i>
        </div>
        <span
          class="at"
          @click="handleAtSomeOne.call(this, 'backDevelopPmList')"
          >@</span
        >
      </el-form-item>

      <el-form-item label="前端开发人员" prop="frontDevelopList">
        <div
          v-if="dataForm.frontDevelopList.length > 0"
          class="pinglun-bottom-content top"
        >
          <div v-if="dataForm.frontDevelopList.length > 0">
            <el-tag
              size="mini"
              style="margin: 2px 4px"
              v-for="tag in dataForm.frontDevelopList"
              :key="tag.staffId"
              @close="frontDevelopListCloseItem(tag)"
              closable
            >
              {{ tag.realName }}
            </el-tag>
          </div>
          <i @click="dataForm.frontDevelopList = []" style="font-size: 20px">
          </i>
        </div>
        <span class="at" @click="handleAtSomeOne.call(this, 'frontDevelopList')"
          >@</span
        >
      </el-form-item>

      <el-form-item label="前端负责人" prop="frontDevelopPmList">
        <div
          v-if="dataForm.frontDevelopPmList.length > 0"
          class="pinglun-bottom-content top"
        >
          <div v-if="dataForm.frontDevelopPmList.length > 0">
            <el-tag
              size="mini"
              style="margin: 2px 4px"
              v-for="tag in dataForm.frontDevelopPmList"
              :key="tag.staffId"
              @close="frontDevelopPmListCloseItem(tag)"
              closable
            >
              {{ tag.realName }}
            </el-tag>
          </div>
          <i @click="dataForm.frontDevelopPmList = []" style="font-size: 20px">
          </i>
        </div>
        <span
          class="at"
          @click="handleAtSomeOne.call(this, 'frontDevelopPmList')"
          >@</span
        >
      </el-form-item>

      <el-form-item label="测试人员" prop="testStaffList">
        <div
          v-if="dataForm.testStaffList.length > 0"
          class="pinglun-bottom-content top"
        >
          <div v-if="dataForm.testStaffList.length > 0">
            <el-tag
              size="mini"
              style="margin: 2px 4px"
              v-for="tag in dataForm.testStaffList"
              :key="tag.staffId"
              @close="testStaffListCloseItem(tag)"
              closable
            >
              {{ tag.realName }}
            </el-tag>
          </div>
          <i @click="dataForm.testStaffList = []" style="font-size: 20px"> </i>
        </div>
        <span class="at" @click="handleAtSomeOne.call(this, 'testStaffList')"
          >@</span
        >
      </el-form-item>

      <el-form-item label="测试负责人" prop="testStaffPmList">
        <div
          v-if="dataForm.testStaffPmList.length > 0"
          class="pinglun-bottom-content top"
        >
          <div v-if="dataForm.testStaffPmList.length > 0">
            <el-tag
              size="mini"
              style="margin: 2px 4px"
              v-for="tag in dataForm.testStaffPmList"
              :key="tag.staffId"
              @close="testStaffPmListCloseItem(tag)"
              closable
            >
              {{ tag.realName }}
            </el-tag>
          </div>
          <i @click="dataForm.testStaffPmList = []" style="font-size: 20px">
          </i>
        </div>
        <span class="at" @click="handleAtSomeOne.call(this, 'testStaffPmList')"
          >@</span
        >
      </el-form-item>

      <el-form-item label="产品" prop="productStaffList">
        <div
          v-if="dataForm.productStaffList.length > 0"
          class="pinglun-bottom-content top"
        >
          <div v-if="dataForm.productStaffList.length > 0">
            <el-tag
              size="mini"
              style="margin: 2px 4px"
              v-for="tag in dataForm.productStaffList"
              :key="tag.staffId"
              @close="productStaffListCloseItem(tag)"
              closable
            >
              {{ tag.realName }}
            </el-tag>
          </div>
          <i @click="dataForm.productStaffList = []" style="font-size: 20px">
          </i>
        </div>
        <span class="at" @click="handleAtSomeOne.call(this, 'productStaffList')"
          >@</span
        >
      </el-form-item>

      <el-form-item label="其他人员" prop="otherStaffList">
        <div
          v-if="dataForm.otherStaffList.length > 0"
          class="pinglun-bottom-content top"
        >
          <div v-if="dataForm.otherStaffList.length > 0">
            <el-tag
              size="mini"
              style="margin: 2px 4px"
              v-for="tag in dataForm.otherStaffList"
              :key="tag.staffId"
              @close="otherStaffListCloseItem(tag)"
              closable
            >
              {{ tag.realName }}
            </el-tag>
          </div>
          <i @click="dataForm.otherStaffList = []" style="font-size: 20px"> </i>
        </div>
        <span class="at" @click="handleAtSomeOne.call(this, 'otherStaffList')"
          >@</span
        >
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

    <getPersonnel
      @cb="handleCheckStaffIds"
      v-if="isShow"
      :value.sync="form.ids"
      :deplist="ccc"
      :isShow.sync="isShow"
      :showDataList.sync="staffList"
    />
  </el-dialog>
</template>

<script>
import E from 'wangeditor'

var Base64 = require('js-base64').Base64

import {
  apiProcessInfo,
  apiDepartmentInfo,
  addOrUpdateTask
} from '@/api/api_task'

import getPersonnel from '@/components/getPersonnel'

export default {
  data() {
    return {
      visible: false,
      loadData: false,
      staffList: {
        list: []
      },
      ccc: [],
      isShow: false,
      contextEditor: null,
      form: {
        name: '',
        processRate: 0
      },
      dataForm: {
        id: 0,
        branchId: 0,
        name: '',
        context: '',
        backDevelopList: [],
        backDevelopPmList: [],
        frontDevelopList: [],
        frontDevelopPmList: [],
        testStaffList: [],
        testStaffPmList: [],
        productStaffList: [],
        otherStaffList: [],
        backDevelopTime: '',
        frontDevelopTime: '',
        jointDebugTime: '',
        raiseTestTime: '',
        preOnlineTime: '',
        onlineTime: ''
      },
      dataRule: {}
    }
  },
  mounted() {},
  components: { getPersonnel },
  computed: {},
  methods: {
    async init(id, branchId) {
      this.dataForm = this.$options.data().dataForm
      this.dataForm.id = id
      this.visible = true
      this.dataForm.branchId = branchId
      this.loadData = false
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        if (this.contextEditor === null) {
          this.contextEditor = new E('#contextEditorElem')
          this.contextEditor.customConfig.uploadImgServer = '/uploadPicture'
          this.contextEditor.customConfig.uploadFileName = 'file'
          this.contextEditor.customConfig.uploadImgParams = ''
          this.contextEditor.customConfig.debug = true
          this.contextEditor.create()
        }

        if (this.dataForm.id && this.dataForm.id > 0) {
          apiProcessInfo({
            taskId: this.dataForm.id
          }).then(data => {
            if (data && data.code === 1000) {
              this.dataForm = data.data.task
              this.ccc = data.data.departmentList
              if (this.contextEditor !== null) {
                this.contextEditor.txt.html(this.dataForm.context || '')
              }
            }
          })
        }
        apiDepartmentInfo({
          taskId: this.dataForm.id
        }).then(data => {
          if (data && data.code === 1000) {
            this.ccc = data.data.departmentList
            this.loadData = true
          }
        })
      })
    },
    handleCheckStaffIds(data) {
      console.log(data)
      if (this.val === 'backDevelopList') {
        this.dataForm.backDevelopList = this.dataForm.backDevelopList.concat(
          data.list.map(item => {
            return { realName: item.departmentName, staffId: item.staffId }
          })
        )
      } else if (this.val === 'backDevelopPmList') {
        this.dataForm.backDevelopPmList = this.dataForm.backDevelopPmList.concat(
          data.list.map(item => {
            return { realName: item.departmentName, staffId: item.staffId }
          })
        )
      } else if (this.val === 'frontDevelopList') {
        this.dataForm.frontDevelopList = this.dataForm.frontDevelopList.concat(
          data.list.map(item => {
            return { realName: item.departmentName, staffId: item.staffId }
          })
        )
      } else if (this.val === 'frontDevelopPmList') {
        this.dataForm.frontDevelopPmList = this.dataForm.frontDevelopPmList.concat(
          data.list.map(item => {
            return { realName: item.departmentName, staffId: item.staffId }
          })
        )
      } else if (this.val === 'testStaffList') {
        this.dataForm.testStaffList = this.dataForm.testStaffList.concat(
          data.list.map(item => {
            return { realName: item.departmentName, staffId: item.staffId }
          })
        )
      } else if (this.val === 'testStaffPmList') {
        this.dataForm.testStaffPmList = this.dataForm.testStaffPmList.concat(
          data.list.map(item => {
            return { realName: item.departmentName, staffId: item.staffId }
          })
        )
      } else if (this.val === 'productStaffList') {
        this.dataForm.productStaffList = this.dataForm.productStaffList.concat(
          data.list.map(item => {
            return { realName: item.departmentName, staffId: item.staffId }
          })
        )
      } else if (this.val === 'otherStaffList') {
        this.dataForm.otherStaffList = this.dataForm.otherStaffList.concat(
          data.list.map(item => {
            return { realName: item.departmentName, staffId: item.staffId }
          })
        )
      }

      this.isShow = false
    },
    backDevelopListCloseItem(item) {
      this.dataForm.backDevelopList = this.dataForm.backDevelopList.filter(
        i => i !== item
      )
    },
    backDevelopPmListCloseItem(item) {
      this.dataForm.backDevelopPmList = this.dataForm.backDevelopPmList.filter(
        i => i !== item
      )
    },
    frontDevelopListCloseItem(item) {
      this.dataForm.frontDevelopList = this.dataForm.frontDevelopList.filter(
        i => i !== item
      )
    },
    frontDevelopPmListCloseItem(item) {
      this.dataForm.frontDevelopPmList = this.dataForm.frontDevelopPmList.filter(
        i => i !== item
      )
    },
    testStaffListCloseItem(item) {
      this.dataForm.testStaffList = this.dataForm.testStaffList.filter(
        i => i !== item
      )
    },
    testStaffPmListCloseItem(item) {
      this.dataForm.testStaffPmList = this.dataForm.testStaffPmList.filter(
        i => i !== item
      )
    },
    productStaffListCloseItem(item) {
      this.dataForm.productStaffList = this.dataForm.productStaffList.filter(
        i => i !== item
      )
    },
    otherStaffListCloseItem(item) {
      this.dataForm.otherStaffList = this.dataForm.otherStaffList.filter(
        i => i !== item
      )
    },
    handleAtSomeOne(val) {
      if (this.loadData) {
        this.val = val
        this.isShow = true
      } else {
        alert('数据还没有加载完，请等一会。')
      }
    },
    getStaffId(val) {
      var a = []
      val.map(item => {
        a = a.concat(item.staffId)
      })
      return a.join(',')
    },
    alertInfo(msg) {
      this.$message({
        message: msg,
        type: 'success',
        duration: 1500,
        onClose: () => {}
      })
    },
    dataFormSubmit() {
      console.info(
        'backDevelopList',
        this.getStaffId(this.dataForm.backDevelopList)
      )
      console.info(
        'backDevelopPmList',
        this.getStaffId(this.dataForm.backDevelopPmList)
      )
      console.info(
        'frontDevelopList',
        this.getStaffId(this.dataForm.frontDevelopList)
      )
      console.info(
        'frontDevelopPmList',
        this.getStaffId(this.dataForm.frontDevelopPmList)
      )
      console.info(
        'testStaffList',
        this.getStaffId(this.dataForm.testStaffList)
      )
      console.info(
        'testStaffPmList',
        this.getStaffId(this.dataForm.testStaffPmList)
      )
      console.info(
        'productStaffList',
        this.getStaffId(this.dataForm.productStaffList)
      )
      console.info(
        'otherStaffList',
        this.getStaffId(this.dataForm.otherStaffList)
      )

      addOrUpdateTask({
        backDevelops: this.getStaffId(this.dataForm.backDevelopList),
        backDevelopPms: this.getStaffId(this.dataForm.backDevelopPmList),
        frontDevelops: this.getStaffId(this.dataForm.frontDevelopList),
        frontDevelopPms: this.getStaffId(this.dataForm.frontDevelopPmList),
        testStaffs: this.getStaffId(this.dataForm.testStaffList),
        testStaffPms: this.getStaffId(this.dataForm.testStaffPmList),
        productStaffs: this.getStaffId(this.dataForm.productStaffList),
        otherStaffs: this.getStaffId(this.dataForm.otherStaffList),
        taskId: this.dataForm.id,
        branchId: this.dataForm.branchId,
        name: this.dataForm.name,
        context: Base64.encode(this.contextEditor.txt.html()),
        backDevelopTime: this.dataForm.backDevelopTime,
        frontDevelopTime: this.dataForm.frontDevelopTime,
        jointDebugTime: this.dataForm.jointDebugTime,
        raiseTestTime: this.dataForm.raiseTestTime,
        preOnlineTime: this.dataForm.preOnlineTime,
        onlineTime: this.dataForm.onlineTime
      }).then(data => {
        if (data && data.code === 1000) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }
      })
    }
  }
}
</script>
