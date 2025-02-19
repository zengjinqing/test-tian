uniform float u_minVal;
uniform float u_maxVal;
uniform float width;
uniform float height;
uniform sampler2D u_colorMap;
uniform sampler2D u_baseMap;

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec4 finalColor = vec4(0.0);
    vec2 uv = materialInput.st;
    float count = 0.0;
    int ct = 9;
    for(int i = -ct; i <= ct; i++) {
        for(int k = -ct; k <= ct; k++) {
            vec2 uvc = vec2((uv.x * width + float(i)) / width, (uv.y * height + float(k)) / height);
            if(uvc.x < 0.0 || uvc.x > 1.0 || uvc.y < 0.0 || uvc.y > 1.0) {
                continue;
            }
            count++;
            vec4 color = texture(u_colorMap, uvc);
            float value = texture(u_baseMap, uvc).a;
            float tAplh = 1.0;
            if(u_maxVal < u_minVal) {
                if(value > u_minVal) {
                    tAplh = 1.0;
                } else {
                    tAplh = 0.0;
                }
            } else if(u_maxVal == u_minVal) {
                tAplh = 0.0;
            } else {
                if(value >= u_minVal && value <= u_maxVal) {
                    tAplh = 1.0;
                } else {
                    tAplh = 0.0;
                }
            }
            finalColor += vec4(color.rgb, tAplh * color.a);
        }
    }
    material.diffuse = finalColor.rgb / count;
    material.alpha = finalColor.a / count;
    return material;
}
