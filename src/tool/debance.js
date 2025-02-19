export default function createDebance(time) {
    let timer = null;
    return function (callback) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(callback, time);
    }
}