import { websocketURL } from "@/config/ip.config";
import EventListenControl from "../cesium/control";

export default class WebSocketController extends EventListenControl {
    ready = false;
    open = false;
    preRequestList: object[] = [];
    socket: null | WebSocket = null;
    timer: NodeJS.Timeout = null as unknown as NodeJS.Timeout;
    init(key: string, successCallback?: () => void) {
        const socket = new WebSocket(websocketURL + `/${key}`);
        socket.onopen = () => {
            this.ready = true;
            if (this.preRequestList.length > 0) {
                this.preRequestList.forEach((request) => {
                    this.send(request);
                });
            }
            this.open = true;
            successCallback && successCallback();
            // socket.send("");
        };
        socket.onclose = () => {
            this.open = false;
            let self = this;
            setTimeout(() => {
                if (!self.open) {
                    self.init(key);
                }
            }, 1000);
        };
        socket.onmessage = (event) => {
            if (event.data) {
                // const response = JSON.parse(event.data);
                // const url = response.url;
                // this.emit(url, response.data);
                this.emit("/robotmessage", JSON.parse(event.data));
            }
        };
        socket.onerror = (error) => {
            console.log(error);
            // let self = this;
            // setTimeout(() => {
            //     if (self.isClose) {
            //         self.init(key);
            //     }
            // }, 1000);
        }
        this.socket = socket;
    }
    send(data: object) {
        if (!this.open) return;
        if (!this.ready) {
            this.preRequestList.push(data);
            return;
        }
        const dataString = JSON.stringify(data);
        if (this.socket) {
            this.socket.send(dataString);
        } else {
            throw new Error("socket没有初始化");
        }
    }
}