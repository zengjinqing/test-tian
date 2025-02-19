import { onMounted, onBeforeUnmount } from 'vue'

export function useEvent(config) {
    if (!config.callback || !config.element || !config.event) return;
    onMounted(() => {
        config.element.addEventListener(config.event, config.callback);
    });
    onBeforeUnmount(() => {
        config.element.removeEventListener(config.event, config.callback);
    });
}


export function useInterval(config) {
    if (!config.callback || !config.time) return;
    onMounted(() => {
        config.timer = setInterval(config.callback, config.time);
    });
    onBeforeUnmount(() => {
        config.timer && clearInterval(config.timer);
    });
    return config;
}
