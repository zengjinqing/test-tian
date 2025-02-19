import { onBeforeUnmount, onMounted, shallowReactive } from "vue";
import Viewer from "./map";
import EventListenControl from "./control";
import createBubble from './createBubble.jsx'

export default function createMapState() {
    const mapController = new EventListenControl();

    const mapState = shallowReactive<{
        viewer: Viewer | null
    }>({
        viewer: null
    });


    function initViewer(domId: HTMLDivElement) {
        const viewer = new Viewer(domId);
        mapState.viewer = viewer;
        mapController.emit('ready', viewer);
        return viewer;
    }

    function onViewerReady(callback: (viewer: Viewer) => void) {
        onMounted(() => {
            if (mapState.viewer) {
                callback(mapState.viewer);
            } else {
                mapController.on('ready', callback);
                onBeforeUnmount(() => {
                    mapController.remove('ready', callback);
                });
            }
        });
    }

    return {
        mapState,
        initViewer,
        onViewerReady,
        mapController,
        Bubble: createBubble(mapState, onViewerReady)
    };
};