//@ts-ignore
import { getTextArea } from "@/tool/html/textLength";
import { useEvent } from "../vue/vueUse";
import { onMounted } from "vue";

export function setBubbleOffset(bubbleList: { offsetX: number, offsetY: number, value: string }[], width: number, height: number, fontSize: number) {
    let setOffset = () => {
        bubbleList.forEach(bubble => {
            // @ts-ignore
            const result: number = window.result;
            const area = getTextArea(bubble.value, fontSize);
            bubble.offsetX = -(area.width / result + width) / 2;
            bubble.offsetY = -height;
        });
    };

    onMounted(() => {
        setOffset();
    });

    useEvent({
        element: window,
        event: 'resize',
        callback: setOffset
    });
}