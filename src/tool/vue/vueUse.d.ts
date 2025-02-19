export function useEvent(
    config: {
        callback: Function,
        event: string,
        element: HTMLElement | Document | Window
    }
);
export function useInterval(
    config: {
        callback: Function,
        time: number,
        timer: !number
    }
);


export function useElementModelValue(props, emit, modelKey = 'modelValue');
