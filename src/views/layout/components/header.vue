<template>
  <header id="header">
    <div class="left">
      <h1>Confluence</h1>
      <el-dropdown class="choose-project">
        <el-button type="text" v-text="spaceName">
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, i) in spaceList"
            @click.native="onChooseSpace(item)"
            :key="i"
          >
            <span>{{ item.label }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        type="text"
        icon="el-icon-document"
        @click="onCreateDoc"
        style="margin-left: 6px"
        >新建</el-button
      >
      <el-button
        type="text"
        icon="el-icon-delete"
        @click="onDelete"
        style="margin-left: 6px"
        >删除</el-button
      >
    </div>
    <el-dropdown class="username-wrap">
      <div class="username">
        <span>{{ userName }}</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="logout">
          <span>退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="新建"
      :modal-append-to-body="false"
      :visible.sync="showDialog"
      width="450px"
    >
      <el-form ref="form" size="mini" :model="createForm" label-width="70px">
        <el-form-item label="类型">
          <el-radio-group v-model="createForm.type">
            <el-radio label="doc">文档</el-radio>
            <el-radio label="page">普通页面</el-radio>
            <el-radio label="space">项目</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="名称"
          v-show="createForm.type !== 'doc'"
          prop="name"
          :rules="[
            { required: true, validator: onValidateName, trigger: 'blur' }
          ]"
        >
          <el-input v-model="createForm.name" />
        </el-form-item>
        <el-form-item
          label="git地址"
          v-show="createForm.type === 'space'"
          prop="git"
          :rules="[
            { required: true, validator: onValidateGit, trigger: 'blur' }
          ]"
        >
          <el-input v-model="createForm.git" />
        </el-form-item>
        <el-form-item
          label="类型"
          v-show="createForm.type === 'page'"
          prop="path"
          :rules="[
            { required: true, validator: onValidatePath, trigger: 'change' }
          ]"
        >
          <el-select
            v-model="createForm.path"
            class="header"
            popper-class="header"
            filterable
          >
            <el-option
              v-for="item in pageList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit"
            >立即创建</el-button
          >
          <el-button size="mini" @click="showDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </header>
</template>

<script>
import { apiLogout } from '@/api/login'
import { store } from '@/store'
import { apiCreatePage, apiCreateSpace, apiDeleteMenu } from '@/api/doc'
import pageList from '@/config/pageList'

function findDocId(list, path) {
  let result = ''
  for (let i = 0; i < list.length; i++) {
    if (list[i].path === path) {
      result = list[i].id
      return result
    }
    if (list[i].list) {
      result = findDocId(list[i].list, path)
      if (result) {
        return result
      }
    }
  }
  return result
}

export default {
  data() {
    return {
      showDialog: false,
      pageList: pageList,
      createForm: { type: 'doc', path: '', name: '', git: '' },
      userName: JSON.parse(localStorage.getItem('userInfo') || '{}').userName,
      spaceName: localStorage.getItem('spaceName')
    }
  },
  computed: {
    spaceList() {
      return store.spaceList
    },
    menuList() {
      return store.menuList
    }
  },
  methods: {
    logout() {
      apiLogout().then(res => {
        if (res.code === 1000) {
          this.$router.replace({ path: '/login' })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onChooseSpace({ label, value: id }) {
      localStorage.setItem('spaceId', id)
      localStorage.setItem('spaceName', label)
      window.location.href = location.origin + '/doc/home/index'
    },
    onCreateDoc() {
      this.id = findDocId(this.menuList, this.$route.fullPath)
      this.showDialog = true
      sessionStorage.removeItem('cacheHtml')
    },
    onValidateName(rule, val, callback) {
      if (this.createForm.type !== 'doc') {
        if (!val) {
          return callback(new Error('请输入名称'))
        }
      }
      return callback()
    },
    onValidateGit(rule, val, callback) {
      if (this.createForm.type === 'space') {
        if (!val) {
          return callback(new Error('请输项目git地址'))
        }
      }
      return callback()
    },
    onValidatePath(rule, val, callback) {
      if (this.createForm.type === 'page') {
        if (!val) {
          return callback(new Error('请输入路径'))
        } else if (!/^(([a-zA-Z]+)\/)*[a-zA-Z]+$/.test(val)) {
          return callback(new Error('请输入正确格式：abc或a/b'))
        }
      }
      return callback()
    },
    onDelete() {
      this.$confirm('确定要删除此菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          apiDeleteMenu({ id: sessionStorage.getItem('curMenuId') }).then(
            res => {
              if (res.code === 1000) {
                this.$message({ type: 'success', message: '操作成功' })
                sessionStorage.removeItem('curMenuId')
                window.location.href = location.origin + '/doc/home/index'
              } else {
                this.$message.error(res.msg)
              }
            }
          )
        })
        .catch(() => {})
    },
    onSubmit() {
      this.$refs.form.validate(res => {
        if (res) {
          if (this.createForm.type === 'doc') {
            this.$router.push({ path: '/edit', query: { parentId: this.id } })
          } else if (this.createForm.type === 'page') {
            apiCreatePage({
              parentId: this.id,
              name: this.createForm.name,
              url: this.createForm.path,
              spaceId: localStorage.getItem('spaceId')
            }).then(res => {
              if (res.code === 1000) {
                this.$message({ type: 'success', message: '操作成功' })
                setTimeout(() => {
                  window.location.href =
                    location.origin +
                    `/doc/html/${this.createForm.path}?id=${res.id}`
                }, 500)
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            // 创建项目
            apiCreateSpace({
              name: this.createForm.name,
              gitlabUrl: this.createForm.git
            }).then(res => {
              if (res.code === 1000) {
                this.$message({ type: 'success', message: '操作成功' })
                localStorage.setItem('spaceId', res.data.spaceId)
                localStorage.setItem('spaceName', this.createForm.name)
                window.location.href = location.origin + '/doc/home/index'
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
#header {
  background: #205081;
  color: #fff;
  padding: 0 20px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 1000;
  box-sizing: border-box;
  .el-dialog__body {
    padding: 15px 30px 15px 15px;
  }
  .el-select.header {
    width: 100%;
  }
  h1 {
    margin: 0;
    font-size: 20px;
    display: inline-block;
  }
  .el-dropdown {
    margin-left: 10px;
  }
  .el-button--text {
    color: #fff;
  }
  .choose-project {
    display: inline-block;
    .el-button {
      position: relative;
      padding: 0;
      margin-right: 15px;
      &:after {
        position: absolute;
        right: -12px;
        top: 5px;
        content: '';
        display: block;
        width: 0;
        height: 0;
        border: 4px solid transparent;
        border-top-color: #ddd;
      }
    }
  }
  .username-wrap {
    color: #fff;
    outline-color: transparent;
  }
}
</style>
