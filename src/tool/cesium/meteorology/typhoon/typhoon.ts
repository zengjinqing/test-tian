import { Cartesian3, Color, EllipseGeometry, EllipsoidSurfaceAppearance, GeometryInstance, Material, PolygonGeometry, PolygonHierarchy, Primitive, VertexFormat, Math as CesiumMath } from "cesium";
// @ts-ignore
import typhoonFs from './typhoon.fs?raw';
import { Position, RectangleRange } from "../../type/RectangleRange";

type TyphoonRadius = {
    NE12: number,
    NW12: number,
    SE12: number,
    SW12: number,
    NE10: number,
    NW10: number,
    SE10: number,
    SW10: number,
    NE7: number,
    NW7: number,
    SE7: number,
    SW7: number,
}

class TyphoonMaterial extends Material {
    typhoonRadiusData: TyphoonRadius;
    constructor(typhoonRadius: TyphoonRadius, colorString: string = '#0aa1ed') {
        let arr = [typhoonRadius.NE12, typhoonRadius.NW12, typhoonRadius.SE12, typhoonRadius.SW12, typhoonRadius.NE10, typhoonRadius.NW10, typhoonRadius.SE10, typhoonRadius.SW10, typhoonRadius.NE7, typhoonRadius.NW7, typhoonRadius.SE7, typhoonRadius.SW7];
        let max = Math.max(...arr);
        if (max == 0) {
            throw new Error("台风数据错误：最大半径值为0");
        }
        arr.map((item, index) => {
            arr[index] = item / max;
        });
        super({
            fabric: {
                type: 'TyphoonMaterial',
                uniforms: {
                    color: Color.fromCssColorString(colorString),
                    NE12: arr[0],
                    NW12: arr[1],
                    SE12: arr[2],
                    SW12: arr[3],
                    NE10: arr[4],
                    NW10: arr[5],
                    SE10: arr[6],
                    SW10: arr[7],
                    NE7: arr[8],
                    NW7: arr[9],
                    SE7: arr[10],
                    SW7: arr[11],
                },
                source: typhoonFs
            },
            translucent: true,
        });
        this.typhoonRadiusData = typhoonRadius;
    }
    setColor(color: Color) {
        this.uniforms.color = color;
    }

    setRadius(typhoonRadius: TyphoonRadius) {
        let arr = [typhoonRadius.NE12, typhoonRadius.NW12, typhoonRadius.SE12, typhoonRadius.SW12, typhoonRadius.NE10, typhoonRadius.NW10, typhoonRadius.SE10, typhoonRadius.SW10, typhoonRadius.NE7, typhoonRadius.NW7, typhoonRadius.SE7, typhoonRadius.SW7];
        let max = Math.max(...arr);
        if (max == 0) {
            throw new Error("台风数据错误：最大半径值为0");
        }
        arr.map((item, index) => {
            arr[index] = item / max;
        });
        // 以下是十二个方向的半径赋值
        this.uniforms.NE12 = arr[0];
        this.uniforms.NW12 = arr[1];
        this.uniforms.SE12 = arr[2];
        this.uniforms.SW12 = arr[3];
        this.uniforms.NE10 = arr[4];
        this.uniforms.NW10 = arr[5];
        this.uniforms.SE10 = arr[6];
        this.uniforms.SW10 = arr[7];
        this.uniforms.NE7 = arr[8];
        this.uniforms.NW7 = arr[9];
        this.uniforms.SE7 = arr[10];
        this.uniforms.SW7 = arr[11];
    }
}


export class TyphoonPrimitive extends Primitive {
    constructor(position: Position, typhoonRadius: TyphoonRadius, colorString: string = '#0aa1ed') {
        const typhoonMaterial = new TyphoonMaterial(typhoonRadius, colorString);
        let arr = [typhoonRadius.NE12, typhoonRadius.NW12, typhoonRadius.SE12, typhoonRadius.SW12, typhoonRadius.NE10, typhoonRadius.NW10, typhoonRadius.SE10, typhoonRadius.SW10, typhoonRadius.NE7, typhoonRadius.NW7, typhoonRadius.SE7, typhoonRadius.SW7];
        let max = Math.max(...arr);
        super({
            geometryInstances: new GeometryInstance({
                geometry: new EllipseGeometry({
                    center: Cartesian3.fromDegrees(position.lon, position.lat),
                    semiMinorAxis: max,
                    semiMajorAxis: max,
                    rotation: CesiumMath.PI_OVER_FOUR,
                    vertexFormat: VertexFormat.POSITION_AND_ST
                }),
            }),
            appearance: new EllipsoidSurfaceAppearance({
                aboveGround: false,
                material: typhoonMaterial,
            }),
        });
    }
    
}