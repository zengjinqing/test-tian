import { reactive, shallowReactive } from "vue";

function createState<T extends object>(defaultState: T) {
    const state = reactive(defaultState);
    const copyJSON = JSON.stringify(defaultState);
    return {
        state,
        resetState() {
            const copy = JSON.parse(copyJSON);
            for (const key in copy) {
                //@ts-ignore
                state[key] = copy[key];
            }
        }
    };
}

export function createShallowState<T extends object>(defaultState: T) {
    const state = shallowReactive(defaultState);
    const copyJSON = JSON.stringify(defaultState);
    return {
        state,
        resetState() {
            const copy = JSON.parse(copyJSON);
            for (const key in copy) {
                //@ts-ignore
                state[key] = copy[key];
            }
        }
    };
}


export default createState;