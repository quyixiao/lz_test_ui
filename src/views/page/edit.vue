<template>
  <div id="page-edit">
    <el-dialog
      title="保存"
      :modal-append-to-body="false"
      :visible.sync="showDialog"
      width="450px"
    >
      <el-form ref="form" size="mini" :model="createForm" label-width="70px">
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
        >
          <el-input v-model="createForm.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit"
            >确定</el-button
          >
          <el-button size="mini" @click="showDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <footer>
      <el-button type="text" size="mini" @click="onGoBack">取消</el-button>
      <el-button type="primary" size="mini" @click="onSave">保存</el-button>
    </footer>
  </div>
</template>

<script>
import { apiCreateDoc, apiUpdateDocContent } from '@/api/doc'
import { decode } from 'js-base64'
export default {
  name: 'page-edit',
  data() {
    return {
      showDialog: false,
      createForm: { name: '' }
    }
  },
  created() {
    const { id, parentId, name, version } = this.$route.query
    if (id) {
      this.createForm.name = name
      this.type = 'edit'
    }
    this.parentId = parentId
    this.id = id
    this.version = version
    window.onbeforeunload = () => ''
    this.$once('hook:beforeDestroy', () => {
      window.onbeforeunload = () => null
      window.removeEventListener('popstate', this.onGoBack, false)
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', vm.onGoBack, false)
      }
    })
  },
  mounted() {
    const dom = document.querySelector('#editor').cloneNode(true)
    document.querySelector('#page-edit').appendChild(dom)
    setTimeout(() => {
      this.onCalculate()
      this.onShowContent()
    }, 1000)
  },
  methods: {
    onCalculate() {
      const height = document.querySelector('#edui1_toolbarbox').offsetHeight
      const bodyHeight = document.body.offsetHeight
      window.UE.getEditor('editor').setHeight(bodyHeight - height - 40)
      document
        .querySelector('#page-edit #edui1_iframeholder')
        .classList.add('show')
    },
    onShowContent() {
      const content = sessionStorage.getItem('cacheHtml')
      if (content) {
        window.UE.getEditor('editor').setContent(decode(content), false)
        window.UE.getEditor('editor').setEnabled()
      }
    },
    onSave() {
      // 这里判断是否有id，没有id弹出对话框。有id直接保存
      if (this.id === null) {
        this.showDialog = true
      } else {
        this.saveData()
      }
    },
    onSubmit() {
      console.log('onSubmit')
      this.$refs.form.validate(res => {
        console.log('res')
        console.log(res)
        if (res) {
          this.saveData()
        }
      })
    },
    saveData() {
      const content = window.UE.getEditor('editor').getContent()
      if (this.id) {
        apiUpdateDocContent({
          id: this.id,
          content,
          version: this.version
        }).then(res => {
          if (res.code === 1000) {
            this.$message({ type: 'success', message: '操作成功' })
            this.$router.replace({ path: `/page/${this.id}` })
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        apiCreateDoc({
          parentId: this.parentId,
          content,
          name: this.name
        }).then(res => {
          if (res.code === 1000) {
            this.$message({ type: 'success', message: '操作成功' })
            window.location.href = location.origin + `/page/${res.data.id}`
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    onGoBack() {
      this.$confirm('此操作将不保留输入的内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.id) {
          this.$router.go(-2)
        }
        this.$router.replace({ path: `/page/${this.id}` })
      })
    }
  }
}
</script>

<style lang="less">
#page-edit {
  #editor {
    display: block !important;
  }
  #edui1_iframeholder {
    display: none;
    &.show {
      display: block;
    }
  }
  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 40px;
    padding: 7px 20px 5px;
    box-sizing: border-box;
    .el-button {
      float: right;
      &:first-child {
        margin-left: 10px;
      }
    }
  }
}
</style>
