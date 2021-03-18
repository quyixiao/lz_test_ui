<template>
  <div id="app">
    <router-view :key="$route.fullPath + num" />
  </div>
</template>

<script>
import { store } from '@/store'
export default {
  computed: {
    num() {
      return store.curClickMenuNum
    }
  }
}
</script>

<style lang="less">
#app {
  height: 100vh;
}
</style>
