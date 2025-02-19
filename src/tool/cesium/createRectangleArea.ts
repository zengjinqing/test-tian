import { CallbackProperty, Cartesian2, Cartographic, Math as CesiumMath, Color, Entity, Rectangle, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer } from "cesium";
import { reactive } from "vue";

export function windowPositionToLocation(viewer: Viewer, position: Cartesian2) {
    let ray = viewer.camera.getPickRay(position);
    if (!ray) return;
    let cartesian = viewer.scene.globe.pick(ray, viewer.scene);  
    if (!cartesian) {  
        // 如果没有拾取到任何对象(比如点击在了天空上)，则使用射线与椭球体相交  
        cartesian = viewer.camera.pickEllipsoid(position, viewer.scene.globe.ellipsoid);  
        if(!cartesian){
            return;
        }
    }
    let cartographic = Cartographic.fromCartesian(cartesian);
    let lon = CesiumMath.toDegrees(cartographic.longitude); // 经度
    let lat = CesiumMath.toDegrees(cartographic.latitude); // 纬度
    return { lon, lat };
}


export function createRectangleArea(viewer: Viewer, callback = (position: any) => { }) {
    let handler: ScreenSpaceEventHandler = new ScreenSpaceEventHandler(viewer.canvas);
    const areaPositions = reactive({
        startLng: 0, startLat: 0,
        endLng: 0,
        endLat: 0,
        minLng: 0,
        maxLng: 0,
        minLat: 0,
        maxLat: 0,
    });

    function handleBeginClick(event: ScreenSpaceEventHandler.PositionedEvent) {
        const position = windowPositionToLocation(viewer, event.position);
        if (!position) return;
        const { lon, lat } = position;
        areaPositions.startLng = lon;
        areaPositions.startLat = lat;
        areaPositions.endLng = lon + 0.000001;
        areaPositions.endLat = lat + 0.000001;
        viewer.entities.removeById('rectangleArea');
        const entity = new Entity({
            id: 'rectangleArea',
            rectangle: {
                coordinates: new CallbackProperty(() => {
                    let minLng, maxLng, minLat, maxLat;
                    if (areaPositions.startLng < areaPositions.endLng) {
                        minLng = areaPositions.startLng;
                        maxLng = areaPositions.endLng;
                    } else {
                        minLng = areaPositions.endLng;
                        maxLng = areaPositions.startLng;
                    }
                    if (areaPositions.startLat < areaPositions.endLat) {
                        minLat = areaPositions.startLat;
                        maxLat = areaPositions.endLat;
                    } else {
                        minLat = areaPositions.endLat;
                        maxLat = areaPositions.startLat;
                    }
                    areaPositions.minLng = minLng;
                    areaPositions.minLat = minLat;
                    areaPositions.maxLng = maxLng;
                    areaPositions.maxLat = maxLat;
                    return Rectangle.fromDegrees(minLng, minLat, maxLng, maxLat);
                }, false),
                material: Color.fromCssColorString('#0aa1ed66'),
                outline: true, // height must be set for outline to display
                outlineColor: Color.YELLOW,
                outlineWidth: 2,
                height: 0.01,
            },
        });
        viewer.entities.add(entity);
        destoryEvent();

        handler.setInputAction((event: ScreenSpaceEventHandler.MotionEvent) => {
            const result = windowPositionToLocation(viewer, event.endPosition);
            if (result) {
                areaPositions.endLat = result.lat;
                areaPositions.endLng = result.lon;
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction((event: ScreenSpaceEventHandler.PositionedEvent) => {
            const result = windowPositionToLocation(viewer, event.position);
            if (result) {
                areaPositions.endLat = result.lat;
                areaPositions.endLng = result.lon;
            }
            destoryEvent();
            handler.setInputAction(handleBeginClick, ScreenSpaceEventType.LEFT_CLICK);
            if (callback) callback(areaPositions);
        }, ScreenSpaceEventType.LEFT_CLICK);
    }
    handler.setInputAction(handleBeginClick, ScreenSpaceEventType.LEFT_CLICK);

    function destoryEvent() {
        if (!handler) return;
        handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
    }

    function destory() {
        destoryEvent();
        // @ts-ignore
        handler = null;
    }

    return {
        destory,
        areaPositions
    }
}