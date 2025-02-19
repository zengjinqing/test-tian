import { onBeforeUnmount, onMounted } from "vue";

class EventListenControl {
    container = {};
    on(evt, callback) {
        if (!this.container[evt]) this.container[evt] = [];
        this.container[evt].push(callback);
    }
    emit(evt, ...arg) {
        if (this.container.hasOwnProperty(evt))
            this.container[evt].forEach((fn) => {
                fn(...arg);
            })
    }
    remove(evt, callback) {
        if (this.container[evt] && this.container[evt] instanceof Array) {
            let idx = this.container[evt].findIndex((el) => el == callback);
            if (idx >= 0) {
                this.container[evt].splice(idx, 1);
            }
        }
    }
    listen(evt, callback) {
        const controller = this;
        onMounted(() => {
            controller.on(evt, callback);
        });
        onBeforeUnmount(() => {
            controller.remove(evt, callback);
        });
    }
    emitKeys(keys) {
        keys.forEach(key => {
            this.emit(key);
        });
    }
}

export default EventListenControl;