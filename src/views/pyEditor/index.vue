<template>
  <div
    class="py-editor-wrap"
    v-loading="loading"
    element-loading-background="rgba(255, 255, 255, 0.6)"
  >
    <div class="border">
      <pre id="py-editor"></pre>
      <el-form ref="form" :model="data" inline :rules="rules">
        <el-form-item label="接口名" prop="name">
          <el-input size="small" v-model="data.name"></el-input>
        </el-form-item>
        <el-form-item label="文件名">
          <el-input size="small" v-model="data.fileName"></el-input>
        </el-form-item>
        <footer>
          <el-button size="small" @click="onTempStorage">暂存</el-button>
          <el-button
            size="small"
            type="success"
            @click="onTestCode"
            style="padding: 9px 30px"
            >运 行</el-button
          >
          <el-button size="small" type="primary" @click="onSubmit"
            >保存</el-button
          >
          <el-button size="small" type="warning" @click="onCopy"
            >复制</el-button
          >
          <el-button size="small" type="danger" @click="onClear"
            >清空</el-button
          >
        </footer>
      </el-form>
    </div>
    <div class="border result">
      <h5>执行结果</h5>
      <p v-html="testResult"></p>
    </div>
  </div>
</template>

<script>
import { apiModifyPory, apiTestPort } from '@/api/port'
export default {
  data() {
    return {
      data: {},
      loading: false,
      hasChange: false,
      rules: {
        name: [{ required: true, message: '请输入接口名', trigger: 'blur' }]
      },
      testResult: ''
    }
  },
  watch: {
    hasChange(val) {
      if (val) {
        window.onbeforeunload = () => ''
      } else {
        window.onbeforeunload = null
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(() => {
      if (from.path === '/html/port/list') {
        localStorage.removeItem('python2')
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasChange) {
      this.$confirm('是否要暂存代码?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
        .then(() => {
          this.onTempStorage()
          this.$nextTick(() => {
            next()
          })
        })
        .catch(() => {
          this.hasChange = false
          this.$nextTick(() => {
            next()
          })
        })
    } else {
      next()
    }
  },
  created() {
    this.id = this.$route.params.id
    if (this.id) {
      this.data = JSON.parse(this.$route.query.data)
    }
  },
  mounted() {
    this.onInit()
  },
  methods: {
    onInit() {
      window.ace.require('ace/ext/language_tools')
      var editor = (this.editor = window.ace.edit('py-editor'))
      editor.session.setMode('ace/mode/python')
      editor.setTheme('ace/theme/chrome')
      editor.setFontSize(14)
      editor.setShowPrintMargin(false)
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      })
      editor.getSession().on('change', () => {
        this.hasChange = !!this.editor.getValue()
      })
      if (localStorage.getItem('python2')) {
        editor.setValue(localStorage.getItem('python2'))
        this.copyProt = true
        this.data.name = ''
      } else if (this.id) {
        editor.setValue(localStorage.getItem('pythonEdit'))
      } else {
        editor.setValue(localStorage.getItem('python') || '')
      }
      this.$nextTick(() => {
        this.hasChange = false
      })
    },
    onTempStorage() {
      this.hasChange = false
      localStorage.setItem('python', this.editor.getValue())
    },
    onClear() {
      this.editor.setValue('')
    },
    onCopy() {
      this.copyProt = true
      localStorage.setItem('python2', this.editor.getValue())
      this.hasChange = false
      this.$nextTick(() => {
        window.location.reload()
      })
    },
    onTestCode() {
      this.loading = true
      apiTestPort({ code: this.editor.getValue() }).then(res => {
        this.loading = false
        if (res.code === 1000) {
          this.$message({ type: 'success', message: '测试成功' })
          this.testResult = res.data.reduce((total, item) => {
            return (total += `<p style="color: ${item.color}">${item.content}</p>`)
          }, '')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          apiModifyPory({
            id: this.copyProt ? undefined : this.id,
            code: this.editor.getValue(),
            name: this.data.name,
            fileName: this.data.fileName,
            menuId: this.$route.query.menuId || this.data.menuId
          }).then(res => {
            if (res.code === 1000) {
              this.hasChange = false
              this.$message({ type: 'success', message: '操作成功' })
              if (this.copyProt) {
                window.history.go(-2)
              } else {
                this.$router.go(-1)
              }
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.py-editor-wrap {
  padding: 10px;
  box-sizing: border-box;
  .border {
    border: 1px solid #ddd;
    border-radius: 0 0 5px 5px;
    & + .border {
      border-radius: 5px;
      margin-top: 20px;
    }
    h5 {
      margin: 0;
      padding-left: 15px;
      height: 40px;
      line-height: 40px;
      background-color: #ebebeb;
    }
    p {
      min-height: 50px;
      padding: 0 10px;
      line-height: 16px;
      font-size: 14px;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
  .el-form {
    padding-top: 10px;
    margin-bottom: 0px;
    text-align: right;
    .el-form-item {
      margin-bottom: 14px;
    }
    .el-form-item__error {
      padding-top: 0;
    }
  }
  height: 100%;
  #py-editor {
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    width: 100%;
    min-height: 600px;
    margin: 0;
  }
  footer {
    display: inline-block;
    padding: 4px 10px 2px 12px;
  }
}
</style>
