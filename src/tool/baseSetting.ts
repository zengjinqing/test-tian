const htmlDOM = document.getElementsByTagName('html')[0];
const bilv = 1920 / 1080;

type ScreenSize = {
    size: number;
};
export const screenSize: ScreenSize = {
    size: 16
}

export default function initBaseSetting() {
    function resizeFontSize() {
        if (window.innerWidth / window.innerHeight > bilv) {
            screenSize.size = 16 / 1080 * window.innerHeight;
        } else {
            screenSize.size = 16 / 1920 * window.innerWidth;
        }
        htmlDOM.style.cssText = `font-size:${screenSize.size}px`;
    }
    resizeFontSize();
    window.addEventListener('resize', resizeFontSize);
}


export function fontSize(number: number) {
    return number / 16 * screenSize.size;
}