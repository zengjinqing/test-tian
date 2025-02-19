import { port } from '@/config/ip.config';
import { ElMessageBox } from 'element-plus';

const isDEV = process.env.NODE_ENV === "development";

function getQueryString(object, front = "") {
    let result = "";
    for (let key in object) {
        const element = object[key];
        console.log(key, element);
        if (front) key = `[${key}]`
        if (typeof element === 'number' || typeof element === 'string') {
            result += `${front}${key}=${element}&`;
        } else if (typeof element === 'object') {
            result += getQueryString(element, front + key);
        }
    };
    if (!front) {
        result = result.replace(/&$/, '');
        result = result.length > 0 ? ("?" + result) : result;
    }
    return result;
}

function pretreateRequestData(data) {
    if (data instanceof FormData) {
        return data;
    } else if (data) {
        return JSON.stringify(data);
    } else {
        return null
    }
}
let requestAlert = false;

class RequestInstance {
    requestIntercepterList = [];
    headers = {};
    baseURL = "";
    URLS = [];
    constructor(baseURL) {
        if (typeof baseURL === 'string') {
            this.baseURL = baseURL;
        } else if (baseURL instanceof Array) {
            this.baseURL = baseURL[0];
            this.URLS = baseURL;
        }
    }

    setRequestInterceptor(requestInterceptor) {
        this.requestIntercepterList.push(requestInterceptor);
    }

    post(url, data, { headers, responseType, mock, URLindex }) {
        const finalURL = this.getFullURL(url, mock, URLindex);
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    ...this.headers,
                    ...headers,
                },
                url: finalURL,
            };
            if (!(data instanceof FormData)) {
                config.headers['Content-Type'] = 'application/json';
            }
            this.requestIntercepterList.forEach(requestIntercepter => requestIntercepter(config));
            fetch(config.url, {
                method: "POST",
                headers: config.headers,
                body: pretreateRequestData(data),
                // signal: cancelToken ? cancelToken.signal : null,
            }).then(async response => {
                const result = await handleResponse(response, responseType);
                if (result) resolve(result);
                else return new Promise(() => { });
            }).catch(error => {
                console.log(error);
                reject(error)
            });
        })
    }

    put(url, data, { headers, responseType, mock, URLindex }) {
        const finalURL = this.getFullURL(url, mock, URLindex);
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    ...this.headers,
                    ...headers,
                },
                url: finalURL,
            };
            if (!(data instanceof FormData)) {
                config.headers['Content-Type'] = 'application/json';
            }
            this.requestIntercepterList.forEach(requestIntercepter => requestIntercepter(config));
            fetch(config.url, {
                method: "POST",
                headers: headers,
                body: pretreateRequestData(data),
                // signal: cancelToken ? cancelToken.signal : null,
            }).then(async response => {
                const result = await handleResponse(response, responseType);
                if (result) resolve(result);
                else return new Promise(() => { });
            }).catch(error => {
                console.log(error);
                reject(error)
            });
        })
    }

    get(url, { headers, params, responseType, mock, URLindex }) {
        const finalURL = this.getFullURL(url, mock, URLindex);
        return new Promise(async (resolve, reject) => {
            const config = {
                headers: {
                    ...this.headers,
                    ...headers,
                },
                queryString: params ? getQueryString(params) : '',
                url: finalURL,
            };
            this.requestIntercepterList.forEach(requestIntercepter => requestIntercepter(config));
            await fetch(config.url + config.queryString, {
                method: "GET",
                headers: config.headers,
                // signal: cancelToken ? cancelToken.signal : null,
            }).then(async response => {
                const result = await handleResponse(response, responseType);
                if (result) resolve(result);
                else return new Promise(() => { });
            }).catch(error => {
                reject(error)
            });
        })
    }

    getFullURL(url, mock, URLindex) {
        const baseURL = URLindex > 0 ? this.URLS[URLindex] : this.baseURL;
        const finalURL = ((mock && isDEV) ? `http://localhost:${port}` : baseURL) + url;
        return finalURL;
    }
}

function objectToFormData(object) {
    const formData = new FormData();
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const value = object[key];
            formData.append(key, value);
        }
    }
    return formData; x
}

export class CancelToken {
    constructor(callback) {
        this.controller = new AbortController();
        callback(this);
    }

    clear() {
        this.controller.abort();
    }
}

async function handleResponse(response, responseType) {
    if (response && response.status === 200) {
        if (responseType === 'blob') {
            const blob = await response.blob();
            let fileName = "";
            let contentDisposition = response.headers.get('content-disposition') ? response.headers.get('content-disposition') : response.headers.get('Content-Disposition');
            if (contentDisposition) {
                let contentDispositionFileName = contentDisposition.split('filename=')[1];
                if (contentDispositionFileName) fileName = contentDispositionFileName;
            }
            return {
                blob,
                header: response.headers,
                fileName,
            }
        } else {
            return await response.json();
        }
    } else {
        if (response.status === 500) {
            ElMessageBox.alert('服务器错误');

        }
        if (response.status === 401) {
            ElMessageBox.alert('无权限访问服务器接口');
        }
        if (response.status === 404) {
            ElMessageBox.alert('无效请求');
        }
        if (response.status === 402 && requestAlert === false) {
            requestAlert = true;
            ElMessageBox.alert('登录过期，请重新登录').then(() => {
                window.present.router.push({ name: 'Login' });
                requestAlert = false;
            }).catch(_ => {
                requestAlert = false;
            });
        }
        return null;
    }
}



export default RequestInstance;
