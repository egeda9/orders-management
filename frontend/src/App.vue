<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow-y: auto;
  margin: 0;
  padding: 0;
  background-color: #F5F7FA;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2C3E50;
}

#app {
  min-height: 100vh;
}
</style>