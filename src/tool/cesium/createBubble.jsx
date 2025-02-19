import { getCurrentInstance, onBeforeUnmount, reactive } from "vue";
import * as Cesium from "cesium";

export default function createBubble(mapState, onViewerReady) {
    return {
        setup(props, { slots }) {
            const state = reactive({
                x: 0,
                y: 0,
                active: 0,
            });

            // function getViewer() {
            //     if (mapState.viewer) return mapState.viewer;
            //     else if (mapState.viewerList) {
            //         const currentInstance = getCurrentInstance();
            //         if (!currentInstance) {
            //             throw new Error('组件实例不存在');
            //         }
            //         let id = currentInstance.props.viewerId;
            //         const viewer = mapState.viewerList[id==0?];
            //     }
            // }

            onBeforeUnmount(() => {
                if (mapState.viewer) {
                    mapState.viewer.scene.postRender.removeEventListener(handleRender);
                }
            });

            onViewerReady(() => {
                handleRender();
                mapState.viewer.scene.postRender.addEventListener(handleRender);
            });

            function handleRender() {
                const position = Cesium.Cartesian3.fromDegrees(props.lon, props.lat, props.height);
                const screen = Cesium.SceneTransforms.worldToWindowCoordinates(mapState.viewer.scene, position);
                if (screen) {
                    state.x = screen.x;
                    state.y = screen.y;
                }
            }
            return () => (
                <div class="bubble-container"
                    style={`position: absolute;left: calc(${state.x}px + ${props.offsetX}rem); top: calc(${state.y}px + ${props.offsetY}rem)`}>
                    {slots.default && slots.default()}
                </div>
            )
        },
        props: {
            lon: {
                type: Number,
                default: 0,
            },
            lat: {
                type: Number,
                default: 0,
            },
            height: {
                type: Number,
                default: 0,
            },
            offsetX: {
                type: Number,
                default: 0,
            },
            offsetY: {
                type: Number,
                default: 0,
            },
        },
    };
}