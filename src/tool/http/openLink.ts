import store from "@/store";

export function openLink(url: string) {
    window.open(url, '_blank');
    // if (store.terminal === 'WEB') {
    //     window.open(url, '_blank');
    // }
}