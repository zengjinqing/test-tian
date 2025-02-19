uniform vec4 color;
uniform float NW12;
uniform float NE12;
uniform float SE12;
uniform float SW12;
uniform float NW10;
uniform float NE10;
uniform float SE10;
uniform float SW10;
uniform float NW7;
uniform float NE7;
uniform float SE7;
uniform float SW7;

float dwind(vec2 uv, vec4 ri, vec3 co) {
    float re = 0.;
    if(uv.x * co.x > 0. && uv.y * co.y > 0. && ri.y <= ri.x) {
        if(co.z > 0.) {
            re = ri.w;
        }
        if(ri.y > ri.x - 2. * ri.b) {
            re = 1.;
        }
    }
    return re;
}

// 2维线段sdf函数其中参数：p：当前点位置，a：起点位置，b：终点位置,返回值：点渲染的颜色的透明度
float lineSdf(vec2 p, vec2 a, vec2 b) {
    vec2 ap = p - a;
    vec2 ab = b - a;
    float vl = dot(ap, ab) / dot(ab, ab);
    if(vl >= 0. && vl <= 1.) {
        vec2 hv = ap - vl * ab;
        float d = length(hv);
        if(d < fwidth(p.x)) {
            return 1.;
        } else {
            return 0.;
        }
    } else {
        return 0.;
    }
}

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = color.rgb;
    vec2 uv = (materialInput.st - 0.5) * 2.;
    float d = length(uv);
    float w = fwidth(max(uv.x, uv.y));
    float apl = 0.;
    float ia = clamp(d, 0., .4);
    apl += dwind(uv, vec4(SW12, d, w, ia), vec3(-1., -1., 1.));
    apl += dwind(uv, vec4(NE12, d, w, ia), vec3(1., 1., 1.));
    apl += dwind(uv, vec4(NW12, d, w, ia), vec3(-1., 1., 1.));
    apl += dwind(uv, vec4(SE12, d, w, ia), vec3(1, -1., 1.));

    apl += dwind(uv, vec4(SW10, d, w, ia), vec3(-1., -1., -1.));
    apl += dwind(uv, vec4(NE10, d, w, ia), vec3(1., 1., -1.));
    apl += dwind(uv, vec4(NW10, d, w, ia), vec3(-1., 1., -1.));
    apl += dwind(uv, vec4(SE10, d, w, ia), vec3(1, -1., -1.));

    apl += dwind(uv, vec4(SW7, d, w, ia), vec3(-1., -1., -1.));
    apl += dwind(uv, vec4(NE7, d, w, ia), vec3(1., 1., -1.));
    apl += dwind(uv, vec4(NW7, d, w, ia), vec3(-1., 1., -1.));
    apl += dwind(uv, vec4(SE7, d, w, ia), vec3(1, -1., -1.));

    apl += lineSdf(uv, vec2(-NW12, 0.), vec2(-SW12, 0.));
    apl += lineSdf(uv, vec2(-NW10, 0.), vec2(-SW10, 0.));
    apl += lineSdf(uv, vec2(-NW7, 0.), vec2(-SW7, 0.));

    apl += lineSdf(uv, vec2(NE12, 0.), vec2(SE12, 0.));
    apl += lineSdf(uv, vec2(NE10, 0.), vec2(SE10, 0.));
    apl += lineSdf(uv, vec2(NE7, 0.), vec2(SE7, 0.));

    apl += lineSdf(uv, vec2(0., NW12), vec2(0., NE12));
    apl += lineSdf(uv, vec2(0., NW10), vec2(0., NE10));
    apl += lineSdf(uv, vec2(0., NW7), vec2(0., NE7));

    apl += lineSdf(uv, vec2(0., -SW12), vec2(0., -SE12));
    apl += lineSdf(uv, vec2(0., -SW10), vec2(0., -SE10));
    apl += lineSdf(uv, vec2(0., -SW7), vec2(0., -SE7));

    apl = clamp(apl, 0., 1.);
    material.alpha = apl;
    return material;
}