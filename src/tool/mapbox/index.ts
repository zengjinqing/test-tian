import { onBeforeUnmount, onMounted, shallowReactive } from "vue";
import EventListenControl from "./control";
import mapboxGl from 'mapbox-gl'

export default function createMap() {
    const mapController = new EventListenControl();

    const mapState = shallowReactive<{
        map: mapboxGl.Map | null
    }>({
        map: null
    });


    function initMap(domId: string) {
        mapboxGl.accessToken = 'pk.eyJ1IjoieWlob25nMDYxOCIsImEiOiJja2J3M28xbG4wYzl0MzJxZm0ya2Fua2p2In0.PNKfkeQwYuyGOTT_x9BJ4Q';
        const map = new mapboxGl.Map({
            container: domId,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [111.949, 40],
            zoom: 9
        });
        mapState.map = map;
        map.on('load', () => {
            mapController.emit('ready', map);
        });
        return map;
    }

    function onMapLoaded(callback: (map: mapboxGl.Map) => void) {
        onMounted(() => {
            if (mapState.map) {
                callback(mapState.map);
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
        initMap,
        onMapLoaded,
        mapController,
    };
};