import * as Cesium from 'cesium'
import './cesiumMap.css';
import { windowPositionToLocation } from './createRectangleArea';
// @ts-ignore
import { baseURL } from '@/config/ip.config.ts';

// @ts-ignore
import whitePNG from './white.png';

const tk = "0b3740819db4b80a56f0a41d7fe0754e";
const TDTTest = `http://t0.tianditu.gov.cn/img_w/wmts?tk=${tk}`;
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmOTA3YmExOC1hYjdjLTRkMGUtYjBhNi1kNTFjN2EyYWFjYzkiLCJpZCI6NDY4ODksImlhdCI6MTYxNjY1NDg1NH0.UbnicaTqvKRBhie0LF5tPs4R4rGfNgOTyWauEGZO4oI';

export default class Viewer extends Cesium.Viewer {
    hander;
    isLocked: boolean = false;
    clickEventList: ClickConfig[] = [];
    constructor(mountedDom: HTMLElement | string) {
        let baseLayer, vectorLayer, textLayerProvider;
        if (process.env.NODE_ENV === "development") {
            baseLayer = new Cesium.ImageryLayer(new Cesium.WebMapTileServiceImageryProvider({
                url: `http://t0.tianditu.gov.cn/img_w/wmts?tk=${tk}`,
                layer: "img",
                style: "default",
                tileMatrixSetID: "w",
                format: "tiles",
                maximumLevel: 18,
            }));
            vectorLayer = new Cesium.WebMapTileServiceImageryProvider({
                url: `http://t0.tianditu.gov.cn/vec_w/wmts?tk=${tk}`,
                layer: "vec",
                style: "default",
                tileMatrixSetID: "w",
                format: "tiles",
                maximumLevel: 18,
            });
            textLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
                url: `http://t0.tianditu.gov.cn/cva_w/wmts?tk=${tk}`,
                layer: "cva",
                style: "default",
                tileMatrixSetID: "w",
                format: "tiles",
                maximumLevel: 10,
            });
        } else {
            baseLayer = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
                url: `${baseURL}/tile/local?type=satellite-tiandi&z={z}&x={x}&y={y}`,
                maximumLevel: 18,
            }))
            vectorLayer = new Cesium.UrlTemplateImageryProvider({
                url: `${baseURL}/tile/local?type=vector-tiandi&z={z}&x={x}&y={y}`,
                maximumLevel: 18,
            })
            textLayerProvider = new Cesium.UrlTemplateImageryProvider({
                url: `${baseURL}/tile/local?type=annotation-tiandi&z={z}&x={x}&y={y}`,
                maximumLevel: 10,
            });
        }

        // 矢量图层
        baseLayer.show = true;
        super(mountedDom, {
            sceneMode: Cesium.SceneMode.SCENE2D,       // 初始化2，3D切换，1：2D模式 2：2D循环模式，3：3D模式
            geocoder: false, // 隐藏搜索
            homeButton: false, // 隐藏主页
            sceneModePicker: false, // 隐藏二三维转换
            baseLayerPicker: false, // 隐藏图层选择控件
            navigationHelpButton: false, // 隐藏帮助按钮
            animation: false, // 隐藏时钟
            timeline: false, // 隐藏时间轴
            fullscreenButton: false, // 隐藏全屏
            vrButton: false, // 隐藏双屏模式
            infoBox: false, // 隐藏点击 entity 信息框
            selectionIndicator: false, // 隐藏点击 entity 绿框
            baseLayer: baseLayer,
        });
        this.scene.globe.maximumScreenSpaceError = 1.7;
        this.scene.postProcessStages.fxaa.enabled = false;
        // this.scene.msaaSamples = 3;
        // this.scene.globe.depthTestAgainstTerrain = true;
        const vectorLayer1 = this.imageryLayers.addImageryProvider(vectorLayer);
        vectorLayer1.show = false;
        const textLayer = this.imageryLayers.addImageryProvider(textLayerProvider);
        textLayer.show = false;

        const whiteProvider = new Cesium.SingleTileImageryProvider({
            url: whitePNG,
            tileWidth: 128,
            tileHeight: 128,
        });
        const whiteLayer = this.imageryLayers.addImageryProvider(whiteProvider);
        whiteLayer.show = false;
        // textLayer.hue = 0.0;
        // textLayer.contrast = 1.1
        // textLayer.brightness = 0.9
        // textLayer.saturation = 0.1
        // textLayer.gamma = 1.1
        this.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.hander = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
        this.hander.setInputAction((e: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const pick = this.scene.pick(e.position);
            const position = windowPositionToLocation(this, e.position);
            console.log(position);
            const allListener = this.clickEventList.find(el => el.name === '');
            if (allListener) {
                allListener.callback(position);
            }
            // return;
            if (!pick || !pick.primitive) return;
            // Primitive
            if (typeof pick.id === 'string') {
                const listener = this.clickEventList.find(el => pick.id.includes(el.name));
                if (!listener) return;
                listener.callback(pick.id, listener.props);
            }
            // Entity
            if (typeof pick.id === 'object') {
                const listener = this.clickEventList.find(el => pick.id.id.includes(el.name));
                if (!listener) return;
                listener.callback(pick.id.id, listener.props);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.toOrigin();
    };

    toOrigin() {
        setTimeout(() => {
            this.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(157.40, 2.42, 40000000)
            })
        }, 300);
    }

    addClick(config: ClickConfig) {
        this.clickEventList.push(config);
        return config;
    }
    removeClick(config: ClickConfig) {
        let index = this.clickEventList.findIndex((el) => el === config);
        if (index < 0) return;
        this.clickEventList.splice(index, 1);
    }

    destroy() {
        super.destroy();
        this.hander.destroy();
    }
};

interface ClickConfig {
    name: string;
    callback: (id: any, props?: any) => void;
    props: any;
}

