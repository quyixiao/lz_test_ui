<template>
  <div id="layout">
    <Header />
    <aside>
      <h1>{{ spaceName }}</h1>
      <Siderbar />
    </aside>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Header from './components/header'
import Siderbar from './components'
import { store } from '@/store'
export default {
  components: { Siderbar, Header },
  data() {
    return {
      btnList: []
    }
  },
  computed: {
    spaceName() {
      return store.spaceName
    }
  }
}
</script>

<style lang="less">
#layout {
  aside {
    float: left;
    width: 220px;
    height: 100vh;
    background: #f5f5f5;
    border-right: 1px solid #ccc;
    position: relative;
    h1 {
      padding-left: 15px;
      font-size: 15px;
      font-weight: bold;
      color: #707070;
      height: 50px;
      line-height: 50px;
      position: absolute;
      top: 40px;
      margin: 0;
      z-index: 1;
      background-color: #f5f5f5;
    }
    .layout-index {
      position: relative;
      height: 100%;
    }
  }
  main {
    height: 100vh;
    padding-top: 40px;
    box-sizing: border-box;
    overflow: auto;
    & > div#page {
      overflow-y: scroll;
      min-height: 100%;
    }
  }
}
</style>
