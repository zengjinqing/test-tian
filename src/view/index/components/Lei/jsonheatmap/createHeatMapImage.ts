type ColorConfig = {
    value: number;
    color: string;
};
type HeatMapConfig = {
    data: number[];
    x: number;
    y: number;
    colorConfig: ColorConfig[];
}

export function createHeatMap(heatMapConfig: HeatMapConfig) {
    const canvas = document.createElement('canvas');
    canvas.width = heatMapConfig.x;
    canvas.height = heatMapConfig.y;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('设备不支持canvas');
    for (let k = 0; k < heatMapConfig.y; k++) {
        for (let i = 0; i < heatMapConfig.x; i++) {
            const pointValue = heatMapConfig.data[k * heatMapConfig.x + i];
            let color = getColor(pointValue, heatMapConfig.colorConfig);
            if (color) {
                ctx.save();
                ctx.fillStyle = color + '99';
                ctx.fillRect(i, k, 1, 1);
                ctx.restore();
            }
        }
    }
    return canvas.toDataURL()
}


export function createFilterMap(heatMapConfig: HeatMapConfig, range: number[]) {
    const canvas = document.createElement('canvas');
    canvas.width = heatMapConfig.x * 12;
    canvas.height = heatMapConfig.y * 12;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('设备不支持canvas');
    for (let k = 0; k < heatMapConfig.y; k++) {
        for (let i = 0; i < heatMapConfig.x; i++) {
            const pointValue = heatMapConfig.data[k * heatMapConfig.x + i];
            let color = getFilterColor(pointValue, heatMapConfig.colorConfig);
            if (color) {
                ctx.save();
                ctx.fillStyle = color;
                ctx.fillRect(i, k, 12, 12);
                ctx.restore();
            }
        }
    }
    return canvas.toDataURL()
}

function getColor(value: number, colorConfig: ColorConfig[]) {
    let color = null;
    if (typeof value !== 'number') return;
    for (let i = 0; i < colorConfig.length; i++) {
        const colorSet = colorConfig[i];
        if (value >= colorSet.value) {
            //@ts-ignore
            color = colorSet.color;
            break;
        }
    }
    return color;
}


function getFilterColor(value: number, range: ColorConfig[]) {
    let range0 = range[range.length - 1].value;
    let range1 = range[0].value;
    if (value > range1) value = range1;
    let deep = (value - range0) / (range1 - range0);
    return `rgb(255,255,255,${deep})`;
}