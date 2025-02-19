<script setup>
import { onMounted, reactive } from "vue";
import { onMapLoaded } from '../../../mapState'
import * as Cesium from 'cesium'
import img from './source/2024080503.png'
import geoJsonData from './source/macau.json'
import bound from './source/macau_boundary1210.json'
import data from './source/data.json'
import { createHeatMap, createFilterMap } from './createHeatMapImage';
const state = reactive({
  heatMap: null,
  heatMapCache: null,
  colorConfig: [
    { color: '#630000', value: 20 },

    { color: '#A10100', value: 15 },

    { color: '#DA1F05', value: 10 },

    { color: '#DA1F05', value: 6 },

    { color: '#FE650D', value: 4 },

    { color: '#F5C349', value: 1.5 },

    { color: '#FFF75D', value: 1 },
    { color: '#FFFFCC', value: 0 },
  ]
})
let viewer, macauSource
onMapLoaded((v) => {
  viewer = v
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113.5600735512203, 22.166650531513177, 80000),
  });
  console.log(data);
  // 生成热力图
  state.heatMap = createHeatMap({
    x: data.lonLength,
    y: data.latLength,
    data: data.data.flat(),
    colorConfig: state.colorConfig
  });
  state.heatMapCache = state.heatMap;
  console.log(bound.geometries[0].coordinates[0][0]);

  const boundPolygon = bound.geometries[0].coordinates[0][0]
  const polygonCartesians = Cesium.Cartesian3.fromDegreesArray(boundPolygon.flat())
  const polygonGeom = new Cesium.PolygonGeometry({
    polygonHierarchy: new Cesium.PolygonHierarchy(polygonCartesians),
  })
  const primitive = new Cesium.GroundPrimitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: polygonGeom
    }),
    appearance: new Cesium.Appearance({
      material: Cesium.Material.fromType('Image', {
        image: state.heatMap
      })
    })
  })
  viewer.scene.primitives.add(primitive)
  Cesium.GeoJsonDataSource.load(geoJsonData).then(function (dataSource) {
    dataSource.entities.values.forEach(function (entity, index) {
      entity.polygon.material = Cesium.Color.fromCssColorString('#000').withAlpha(0.0);
      entity.polygon.outlineColor = Cesium.Color.fromCssColorString("rgba(255,255,255, 0.6)");
    })
    macauSource = dataSource

    viewer.dataSources.add(macauSource);
  });


})
onMounted(() => {

})
</script>

<template>

</template>

<style scoped></style>