<script setup>

import { ref } from "vue";
const result = ref('')
function processData() {
  const worker = new Worker('src/view/index/components/Lei/workertest/worker.js'); // 创建 Web Worker 参数为worker.js文件路径
  worker.onmessage = (event) => { // 监听Web Worker消息处理
    result.value = event.data; // 处理返回的结果
  };
  worker.postMessage('啊啊啊'); // 发送消息给 Web Worker 参数为需要传递的数据

}
</script>

<template>
  <div class="btn">
    <el-button @click="processData">worker发送信息</el-button>

    <div>{{ result }}</div>
  </div>
</template>

<style scoped>
.btn {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  color: aqua;
}
</style>