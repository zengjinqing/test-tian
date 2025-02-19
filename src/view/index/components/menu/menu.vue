<script setup>
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
</script>

<template>
  <div class="menu-container">

    <el-menu class="menu" @select="router.push({ name: $event })" active-text-color="#ffd04b" background-color="#545c64"
      :default-active="route.name" text-color="#fff">
      <div class="title">Test ground</div>
      <el-sub-menu index="1">
        <template #title>
          <el-icon>
            <location />
          </el-icon>
          <span>Zeng</span>
        </template>
        <el-menu-item-group title="Group One">
          <el-menu-item index="1-1" path="/zengIndex">zeng's zone</el-menu-item>
          <el-menu-item index="1-2">secret patrol </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <location />
          </el-icon>
          <span>Lei</span>
        </template>
        <el-menu-item-group title="202501">
          <el-menu-item index="robot" path="/robot">Bad robot</el-menu-item>
          <el-menu-item index="jsonheatmap" path="/jsonheatmap">Json heatmap</el-menu-item>
          <el-menu-item index="workertest" path="/workertest">Worker test</el-menu-item>
          <el-menu-item index="latlon" path="/latlon">lat lon</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>

</template>

<style scoped>
.menu-container {
  width: 230px;
  height: 100vh;
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;

}

.menu {
  height: 100%;
}

.el-menu {
  padding: 30px 0;
  box-sizing: border-box;
  border: 0 !important;

}

.title {
  /* margin-top: 20px; */
  padding: 20 10px;
  color: aqua;
  margin-bottom: 10px;
}
</style>