/**
 * 获取文字所占的高度和宽度
 * @param {string} text 文本 
 * @param {number} fontSize 字号 默认16
*/
export function getTextArea(text: string, fontSize: number = 16) {
    const span = document.createElement('span');
    span.style.cssText = `font-size:${fontSize}`;
    span.innerText = text;
    document.body.appendChild(span);
    const textArea = span.getBoundingClientRect();
    const result = {
        width: textArea.width,
        height: textArea.height
    };
    document.body.removeChild(span);
    return result;
}