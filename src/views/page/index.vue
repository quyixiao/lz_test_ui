<template>
  <div id="page">
    <TopButton :list="btnList" />
    <el-dialog
      :title="dialogTitle"
      :modal-append-to-body="false"
      :visible.sync="showDialog"
      width="450px"
    >
      <el-form ref="form" size="mini" :model="dialogForm" label-width="70px">
        <el-form-item
          label="排期名称"
          v-show="this.dialogType === 'schedule'"
          prop="name"
          :rules="[{ required: true, validator: onFileName, trigger: 'blur' }]"
        >
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item
          label="分支"
          v-show="this.dialogType === 'API'"
          prop="path"
          :rules="[
            { required: true, validator: onAPIVersion, trigger: 'change' }
          ]"
        >
          <el-select
            v-model="version"
            class="header"
            popper-class="header"
            filterable
          >
            <el-option
              v-for="item in versions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="onCreate"
            >立即创建</el-button
          >
          <el-button size="mini" @click="showDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import TopButton from '@/components/topButton'
import { encode } from 'js-base64'
import {
  apiCreatePage,
  apiGetDocContent,
  apiGetSpaceBranchs,
  apiGetBranchsAPI
} from '@/api/doc'
import { store } from '@/store'
import pageList from '@/config/pageList'

function findDocName(list, id) {
  let result = ''
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      result = list[i].title
      return result
    }
    if (list[i].list) {
      result = findDocName(list[i].list, id)
      if (result) {
        return result
      }
    }
  }
  return result
}

export default {
  components: { TopButton },
  name: 'page',
  data() {
    return {
      dialogTitle: '生成接口文档',
      showDialog: false,
      dialogType: 'API',
      versions: [],
      version: '',
      dialogForm: { name: '', path: '' },
      btnList: [
        {
          label: '添加排期管理',
          click: this.onSchedule,
          icon: 'el-icon-edit',
          isShow: false
        },
        {
          label: '生成接口文档',
          click: this.onSacnnerAPI,
          icon: 'el-icon-edit',
          isShow: false
        },
        {
          label: '编辑',
          click: this.onEditDoc,
          icon: 'el-icon-edit',
          isShow: true
        }
      ]
    }
  },
  created() {
    document.title =
      findDocName(this.menuList || [], Number(this.$route.params.id)) || '文档'
  },
  computed: {
    menuList() {
      const menuList = store.menuList
      return menuList
    }
  },
  mounted() {
    console.log(this.$route)
    this.id = this.$route.params.id
    const dom = document.querySelector('#editor').cloneNode(true)
    document.querySelector('#page').appendChild(dom)
    this.timer = setTimeout(() => {
      window.UE.getEditor('editor').setDisabled()
      this.onGetContent()
    }, 1000)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    onGetContent() {
      apiGetDocContent({ id: this.id }).then(res => {
        if (res.code === 1000) {
          this.content = res.data.content
          this.version = res.data.version
          this.type = res.data.type
          if (this.type === 1) {
            this.btnList[0].isShow = false
            this.btnList[1].isShow = true
          } else if (this.type === 2) {
            this.btnList[0].isShow = true
            this.btnList[1].isShow = false
          } else {
            this.btnList[0].isShow = false
            this.btnList[1].isShow = false
          }
          window.UE.getEditor('editor').setContent(this.content, false)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onEditDoc() {
      window.UE.getEditor('editor').setEnabled()
      sessionStorage.setItem('cacheHtml', encode(this.content))
      this.$router.push({
        path: '/edit',
        query: { id: this.id, name: document.title, version: this.version }
      })
    },
    // 生成API
    onSacnnerAPI() {
      apiGetSpaceBranchs().then(res => {
        if (res.code === 1000) {
          console.log(res)
          this.versions = res.data
          this.dialogType = 'API'
          this.dialogTitle = '生成接口文档'
          this.showDialog = true
        }
      })
    },
    // 添加排期
    onSchedule() {
      this.dialogType = 'schedule'
      this.dialogTitle = '添加排期文档'
      this.showDialog = true
    },
    onFileName(rule, val, callback) {
      if (this.dialogType === 'schedule') {
        if (!val) {
          return callback(new Error('请输入名称'))
        }
      }
      return callback()
    },
    onAPIVersion(rule, val, callback) {
      if (this.dialogType === 'API') {
        if (!val) {
          return callback(new Error('请选择分支'))
        }
      }
      return callback()
    },
    onCreate() {
      if (this.dialogType === 'API') {
        // 根据分支扫描源码
        apiGetBranchsAPI({
          gitVersion: this.version
        }).then(res => {
          if (res.code === 1000) {
            console.log(res)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else if (this.dialogType === 'schedule') {
        apiCreatePage({
          parentId: this.id,
          name: this.dialogForm.name,
          url: pageList[0].value,
          spaceId: localStorage.getItem('spaceId')
        }).then(res => {
          if (res.code === 1000) {
            this.$message({ type: 'success', message: '操作成功' })
            window.location.href =
              location.origin + `/doc/html/${this.dialogForm.path}`
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
#page {
  position: relative;
  padding-top: 40px;
  height: 100%;
  box-sizing: border-box;
  #editor {
    display: block !important;
    #edui1_toolbarbox {
      display: none;
    }
  }
  .edui-default .edui-editor {
    border: none;
  }
}
</style>
