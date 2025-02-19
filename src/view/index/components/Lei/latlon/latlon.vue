<script setup>
import { reactive } from "vue";
import { onMapLoaded } from "../../../mapState";
import * as Cesium from 'cesium'


let viewer
onMapLoaded((v) => {
  viewer = v
  // viewer.scene.mode = Cesium.SceneMode.SCENE3D;
  const entities = viewer.entities;
  for (let longitude = -180; longitude <= 180; longitude += 20) {
    let text = "";
    if (longitude === 0) {
      text = "0";
    }
    text += longitude === 0 ? "" : "" + longitude + "°";
    if (longitude === -180) {
      text = "";
    }
    entities.add({
      position: Cesium.Cartesian3.fromDegrees(longitude, 0),
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          longitude,
          -90,
          longitude,
          0,
          longitude,
          90,
        ]),
        width: 1.0,
        material: Cesium.Color.fromCssColorString('rgba(255,255,255,0.5)'),
      },
      label: {
        text: text,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        font: "12px sans-serif",
        fillColor: Cesium.Color.WHITE,
      },
    });
  }
  let langS = [];
  for (let longitude = -180; longitude <= 180; longitude += 5) {
    langS.push(longitude);
  }
  //每隔10读绘制一条纬度线和纬度标注,自己控制间隔
  for (let lat = -80; lat <= 80; lat += 10) {
    let text = "";
    text += "" + lat + "°";
    if (lat === 0) {
      text = "";
    }
    console.log(lat, '---lat');
    entities.add({
      position: Cesium.Cartesian3.fromDegrees(0, lat),
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(
          langS
            .map((long) => {
              return [long, lat].join(",");
            })
            .join(",")
            .split(",")
            .map((item) => Number(item))
        ),
        width: 1.0,
        material: Cesium.Color.fromCssColorString('rgba(255,255,255,0.5)'),
      },
      label: {
        text: text,
        font: "12px sans-serif",
        fillColor: Cesium.Color.WHITE,
      },
    });
  }
  // 抗锯齿
  if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    //判断是否支持图像渲染像素化处理
    viewer.resolutionScale = window.devicePixelRatio;
  }
  //开启抗锯齿
  viewer.scene.fxaa = true;
  viewer.scene.postProcessStages.fxaa.enabled = true;
})
</script>

<template>

</template>

<style scoped></style>