import { onBeforeUnmount, onMounted, shallowReactive, defineProps, getCurrentInstance, onUnmounted } from "vue";
import Viewer from "./map.js";
import EventListenControl from "./control.js";
import createBubble from './createBubble.jsx'
import { Cartesian3, Cartographic, CustomDataSource } from "cesium";

export function createSingleMap() {
    const mapController = new EventListenControl();

    const mapState = shallowReactive<{
        viewer: Viewer | null
    }>({
        viewer: null
    });

    function initMap(domId: HTMLDivElement | string) {
        const viewer = new Viewer(domId);
        mapState.viewer = viewer;
        mapController.emit('ready');
        onUnmounted(() => {
            mapState.viewer?.destroy();
            mapState.viewer = null;
        });
        return viewer;
    }

    function onMapLoaded(callback: (viewer: Viewer, dataSource: CustomDataSource) => void) {
        const customDataSource = new CustomDataSource();
        onMounted(() => {
            if (mapState.viewer) {
                mapState.viewer.dataSources.add(customDataSource);
                callback(mapState.viewer, customDataSource);
                onBeforeUnmount(() => {
                    mapState.viewer && mapState.viewer.dataSources.remove(customDataSource);
                });
            } else {
                const onReady = () => {
                    if (!mapState.viewer) return;
                    mapState.viewer.dataSources.add(customDataSource);
                    callback(mapState.viewer, customDataSource);
                }
                mapController.on('ready', onReady);
                onBeforeUnmount(() => {
                    mapController.remove('ready', onReady);
                    mapState.viewer && mapState.viewer.dataSources.remove(customDataSource);
                });
            }
        });
    }

    return {
        mapState,
        initMap,
        onMapLoaded,
        mapController,
        Bubble: createBubble(mapState, onMapLoaded)
    };
};

export function createMultiMap() {
    const mapController = new EventListenControl();
    const mapState = shallowReactive<{
        viewerList: Viewer[],
    }>({
        viewerList: []
    });

    function initMap(domId: HTMLDivElement[] | string[]) {
        domId.forEach((domId, viewerId) => {
            const viewer = new Viewer(domId);
            mapState.viewerList.push(viewer);
            mapController.emit('ready' + viewerId);
        });
        mapState.viewerList.forEach((viewer, idx1) => {
            const handleMapChange = () => {
                if (!viewer.isLocked) return;
                const destination = Cartographic.toCartesian(viewer.camera.positionCartographic)
                mapState.viewerList.forEach((v, idx2) => {
                    if (idx1 !== idx2 && v.isLocked) {
                        v.camera.setView({
                            destination: new Cartesian3(destination.x, destination.y, destination.z),
                            orientation: {
                                direction: viewer.scene.camera.direction,
                                up: viewer.scene.camera.up,
                                heading: viewer.scene.camera.heading,
                                pitch: viewer.scene.camera.pitch,
                                roll: viewer.scene.camera.roll,
                            },
                        })
                    }
                })
            };
            viewer.camera.changed.addEventListener(handleMapChange);
            viewer.scene.preRender.addEventListener(handleMapChange);
        });
        return mapState.viewerList;
    }

    function onMapLoaded(callback: (viewer: Viewer, dataSource: CustomDataSource) => void) {
        const customDataSource = new CustomDataSource();
        onMounted(() => {
            const currentInstance = getCurrentInstance();
            if (!currentInstance) {
                throw new Error('组件实例不存在');
            }
            let id = currentInstance.props.viewerId as any;
            const viewer = mapState.viewerList[id];
            if (id === '' || id === undefined) id = 0;
            if (viewer) {
                viewer.dataSources.add(customDataSource);
                callback(viewer, customDataSource);
                onBeforeUnmount(() => {
                    viewer && viewer.dataSources.remove(customDataSource);
                });
            } else {
                const onReady = () => {
                    const viewer = mapState.viewerList[id];
                    callback(viewer, customDataSource);
                }
                mapController.on('ready' + id, onReady);
                onBeforeUnmount(() => {
                    const viewer = mapState.viewerList[id];
                    mapController.remove('ready' + id, onReady);
                    viewer && viewer.dataSources.remove(customDataSource);
                });
            }
        });
        onUnmounted(() => {
            mapState.viewerList.forEach(viewer => {
                viewer.destroy();
            });
            mapState.viewerList = [];
        });
    }

    return {
        mapState,
        initMap,
        onMapLoaded,
        mapController,
        Bubble: createBubble(mapState, onMapLoaded)
    };
}