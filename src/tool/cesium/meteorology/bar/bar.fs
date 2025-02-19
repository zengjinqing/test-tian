uniform vec4 color;
czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    float x = 1.0 - abs(sin((st.x - 0.5) * 4.0 * 3.14159265359)) / 2.;
    material.diffuse = color.rgb;
    material.alpha = sqrt(x) * st.y;
    return material;
}