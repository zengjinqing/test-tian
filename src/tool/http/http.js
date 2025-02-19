import store from "@/store";
import RequestInstance, { CancelToken } from "./RequestInstance";
import { baseURL, serverBaseURL } from "@/config/ip.config";


const instance = new RequestInstance([baseURL, serverBaseURL]);
let __requestSourcesList = [];

const __requestSources = {
    push(request) {
        if (__requestSourcesList.length > 150) __requestSourcesList.shift()
        __requestSourcesList.push(request);
    },
    forEach() {
        __requestSourcesList.forEach(request => request());
    },
    clear() {
        __requestSourcesList = [];
    }
};

instance.setRequestInterceptor(config => {
    config.headers.Authorization = sessionStorage.getItem('AUTH') ?? '';
});

function getQueryString(object, front = "") {
    let result = "";
    for (let key in object) {
        const element = object[key];
        if (front) key = `[${key}]`
        if (typeof element === 'number' || typeof element === 'string') {
            result += `${front}${key}=${element}&`;
        } else if (typeof element === 'object') {
            result += getQueryString(element, front + key);
        }
    };
    if (!front) {
        result = "?" + result;
        result = result.replace(/&$/, '');
    }
    return result;
}


/** 
 * post方法，对应post请求 ，发送数据方式为json
 * @param {String} url [请求的url地址] 
 * @param {Object} data [请求时携带的参数] 
 * @param {Object} config [mock: false, URLindex: 0]
 */
export function post(url, data = {}, config = { mock: false, URLindex: 0 }) {
    return new Promise((resolve, reject) => {
        let headers = data.headers ? data.headers : {};
        let requestData = requestDataPretreate(data);
        let queryString = data.query ? getQueryString(data.query) : "";
        instance.post(url + queryString, requestData, {
            headers,
            cancelToken: new CancelToken((source) => __requestSources.push(source)),
            ...config,
        })
            .then(res => {
                resolve(res);
            }).catch(res => {
                reject(res);
            });
    });
}

export function postResBlob(url, data = {}, config = { mock: false, URLindex: 0 }) {
    return new Promise((resolve, reject) => {
        let headers = data.headers ? data.headers : {};
        let requestData = requestDataPretreate(data);
        let queryString = data.query ? "?" + getQueryString(data.query) : "";
        instance.post(url + queryString, requestData, {
            headers,
            cancelToken: new CancelToken(source => __requestSources.push(source)),
            responseType: "blob",
            ...config,
        })
            .then(res => {
                resolve(res);
            }).catch(res => {
                reject(res);
            });
    });
}


/** 
 * get方法，对应post请求 ，发送数据方式为json
 * @param {String} url [请求的url地址] 
 * @param {Object} data [请求时携带的参数] 
 * @param {Object} config [mock: false, URLindex: 0]
 */
export function get(url, data = {}, config = { mock: false, URLindex: 0 }) {
    return new Promise((resolve, reject) => {
        let headers = data.headers ? data.headers : {};
        let params = data.params ? data.params : {};
        instance.get(url, {
            headers,
            params,
            cancelToken: new CancelToken((source) => __requestSources.push(source)),
            ...config,
        })
            .then(res => {
                resolve(res);
            })
            .catch(res => {
                reject(res);
            });
    });
}

//delete方法
// export function deleteMethod(url, data) {
//     return new Promise((resolve, reject) => {
//         let headers = data.headers ? data.headers : {};
//         let requestData = requestDeleteDataPretreate(data);
//         instance.delete(url, { ...requestData, headers, cancelToken: new CancelToken((source) => __requestSources.push(source)) })
//             .then(res => {
//                 if (res) resolve(res.data);
//             }).catch(res => {
//                 reject(res);
//             });
//     });
// }

//调用此方法取消所有网络请求；
export function cancelRequest() {
    __requestSources.forEach(item => item());
    __requestSources.clear();
}

function requestDataPretreate(data) {
    let requestData;
    let { formData, params } = data;
    if (formData) {
        requestData = new FormData()
        for (const key in formData) {
            if (Object.hasOwnProperty.call(formData, key)) {
                requestData.append(key, formData[key]);
            }
        }
    } else if (params) {
        requestData = params;
    } else {
        requestData = {};
    }
    return requestData;
}