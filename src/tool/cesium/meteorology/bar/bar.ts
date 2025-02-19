import { Appearance, Cartesian3, Color, ColorGeometryInstanceAttribute, EllipsoidSurfaceAppearance, Geometry, GeometryInstance, Material, MaterialAppearance, PerInstanceColorAppearance, Primitive, Rectangle, RectangleGeometry, WallGeometry } from "cesium";
import { Position } from "../../type/RectangleRange";
// @ts-ignore
import fs from './bar.fs?raw'

// BarPrimitive类，继承于Primitive类,实现柱状图效果，由一个墙geometry和顶部的矩形primitive构成
export default class BarPrimitive {
    wallPrimitive;
    rectanglePrimitive;
    constructor(position: Position, width: number, height: number, colorString: string = '#0aa1ed') {
        let w = width / 2;
        const wallInstance = new GeometryInstance({
            geometry: new WallGeometry({
                positions: Cartesian3.fromDegreesArrayHeights([
                    position.lon - w, position.lat - w, height,
                    position.lon + w, position.lat - w, height,

                    position.lon + w, position.lat - w, height,
                    position.lon + w, position.lat + w, height,

                    position.lon + w, position.lat + w, height,
                    position.lon - w, position.lat + w, height,

                    position.lon - w, position.lat + w, height,
                    position.lon - w, position.lat - w, height,
                ])
            })
        })
        const rectangleInstance = new GeometryInstance({
            geometry: new RectangleGeometry({
                rectangle: Rectangle.fromDegrees(position.lon - w, position.lat - w, position.lon + w, position.lat + w),
                vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
                height,
            }),
            attributes: {
                color: ColorGeometryInstanceAttribute.fromColor(Color.fromCssColorString(colorString)),
            }
        });

        this.wallPrimitive = new Primitive({
            geometryInstances: [wallInstance],
            appearance: new EllipsoidSurfaceAppearance({
                aboveGround: false,
                material: new Material({
                    fabric: {
                        uniforms: {
                            color: Color.fromCssColorString(colorString),
                        },
                        source: fs,
                    },
                })
            })
        })
        this.rectanglePrimitive = new Primitive({
            geometryInstances: rectangleInstance,
            appearance: new PerInstanceColorAppearance({
                flat: true,
            })
        })
    }
}