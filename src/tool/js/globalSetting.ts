import { Router } from "vue-router";

declare global {
    interface Array<T> {
        findName(name: string): T;
        findKey(key: string, value: any): T
    }

    interface Window {
        present: { router: Router },
    }

}

Object.defineProperty(Array.prototype, 'findName', {
    value: () => { },
    writable: true,
    enumerable:false,
});

Object.defineProperty(Array.prototype, 'findKey', {
    value: () => { },
    writable: true,
    enumerable:false,
});

Array.prototype.findName = function (name: string) {
    return this.find(el => el.name === name);
}

Array.prototype.findKey = function (key, value) {
    return this.find(el => el[key] === value);
}

export { }