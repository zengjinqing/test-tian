import { EllipsoidSurfaceAppearance, GeometryInstance, Material, Primitive, VertexFormat, RectangleGeometry, Rectangle } from "cesium";
// @ts-ignore
import heatMapFs from './heatMap.fs?raw';
import { RectangleRange } from "../../type/RectangleRange";

type HeatMapOption = {
    colorMap: string | HTMLImageElement;
    baseMap: string | HTMLImageElement;
    valueRange: number[];
}

class HeatMapMaterial extends Material {
    heatMapOption: HeatMapOption;
    constructor(heatMapOption: HeatMapOption) {
        super({
            fabric: {
                type: 'HeatMapMaterial',
                uniforms: {
                    u_colorMap: heatMapOption.colorMap,
                    u_baseMap: heatMapOption.baseMap,
                    u_minVal: heatMapOption.valueRange[0],
                    u_maxVal: heatMapOption.valueRange[1],
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
                source: heatMapFs
            },
            translucent: true,
        });
        this.heatMapOption = heatMapOption;
    }

    set(heatMapOption: HeatMapOption) {
        this.uniforms.u_colorMap = heatMapOption.colorMap;
        this.uniforms.u_baseMap = heatMapOption.baseMap;
        this.uniforms.u_minVal = heatMapOption.valueRange[0];
        this.uniforms.u_maxVal = heatMapOption.valueRange[1];
    }
}


export class HeatMapPrimitive extends Primitive {
    heatMapMaterial: HeatMapMaterial;
    constructor(rectangleRange: RectangleRange, heatMapOption: HeatMapOption) {
        const heatMapMaterial = new HeatMapMaterial(heatMapOption);
        super({
            geometryInstances: new GeometryInstance({
                geometry: new RectangleGeometry({
                    rectangle: Rectangle.fromDegrees(rectangleRange.west, rectangleRange.south, rectangleRange.east, rectangleRange.north),
                    vertexFormat: VertexFormat.POSITION_AND_ST,
                    // extrudedHeight:-10.0,
                }),
            }),
            appearance: new EllipsoidSurfaceAppearance({
                aboveGround: true,
                material: heatMapMaterial,
            }),

        });
        this.heatMapMaterial = heatMapMaterial;
    }

    set(heatMapOption: HeatMapOption) {
        this.heatMapMaterial.set(heatMapOption);
    }
}