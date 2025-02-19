interface RequestSource<T> {
    method: Function,
    data?: any,
    success: (data:T) => void,
    fail?: Function,
    afterResponse?: Function,
    noCheckRes?: boolean,
    wait?: null | number
}

export async function $http<T>(requestSource: RequestSource<T>): Promise<T>;