<script setup>
import { onMounted } from "vue";
import Menu from '@/view/index/components/menu/menu.vue'
import { initMap } from './mapState'
let viewer = null
onMounted(() => {
  viewer = initMap("mapContainer");

});

</script>

<template>
  <Menu></Menu>
  <router-view></router-view>
  <div class="map-container" id="mapContainer">

  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>