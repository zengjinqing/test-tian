import { serverBaseURL } from "@/config/ip.config";
import { objectToQuery } from "cesium";

export default class EventStream {
    socket: null | EventSource = null;
    constructor(path: string, data: any, successCallback?: (response: string) => void) {
        data.token = sessionStorage.getItem('AUTH');
        const queryString = objectToQuery(data);
        const socket = new EventSource(serverBaseURL + path + '?' + queryString);
        socket.onopen = () => {
            console.log('eventStream:' + serverBaseURL + path);
        };
        socket.addEventListener('message', (event: MessageEvent<string>) => {
            if (event.data) {
                const data = JSON.parse(event.data);
                // if (data.type === 'end') {
                //     this.close();
                // } else {
                if (successCallback) successCallback(data);
                //}
            }
        });
        socket.onerror = (error) => {
            console.log(error);
            this.close();
        }
        this.socket = socket;
    }
    close() {
        this.socket?.close();
    }
}