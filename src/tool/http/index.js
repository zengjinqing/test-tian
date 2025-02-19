import router from "@/router";
import {createModel_user} from "@/model/user/index.js";
import { ElMessageBox, ElNotification, ElNotification as Notification } from "element-plus";
const { had_onLogout } = createModel_user();
let isError = false;

//HTTP请求相应处理
export function handleResponse(res,
    success = (res) => { console.log(res) },
    fail = (res) => {
        console.log(res);
        Notification.error({
            title: "错误",
            message: res.msg ? res.msg : "请求错误"
        })
    },
    noCheckRes
) {
    if (noCheckRes) {
        return success(res);
    }
    if (res.code === 200) {
        return success(res.data);
    } else if (res.code == 402) {
        ElMessageBox.alert('登录已过期，请重新登录', '提示', {
            confirmButtonText: '确定',
            callback: action => {
                had_onLogout();
            }
        });
        return;
    } else if (res.code == 403) {
        ElNotification.error({
            message: '无权限访问该功能，请联系管理员'
        });
        return;
    } else if (res.code == 401) {
        ElMessageBox.alert('登录已过期，请重新登录', '提示', {
            confirmButtonText: '确定',
            callback: action => {
                had_onLogout();
            }
        });
        return;
    } else if (res.code == 601) {
        ElNotification.warning({
            message: res.msg
        });
        return;
    } else {
        return fail(res);
    }
}

//HTTP请求

export function $http({ method, data, success, fail, afterResponse, streamReceive, noCheckRes = false, wait = null }) {
    let startTime = new Date().getTime();
    return new Promise((resolve) => {
        method(data, streamReceive).then(res => {
            let requestTime = new Date().getTime() - startTime;
            if (res || noCheckRes) {
                const delRes = () => {
                    if (afterResponse) {
                        setTimeout(() => {
                            afterResponse(res)
                        }, 500)
                    }
                    return handleResponse(res, success, fail, noCheckRes);
                }
                if (wait) {
                    let remainTime = wait - requestTime;
                    if (remainTime > 0) {
                        setTimeout(() => {
                            resolve(delRes());
                        }, remainTime)
                    } else {
                        resolve(delRes());
                    }
                } else {
                    resolve(delRes());
                }
            }
        }).catch((error) => {
            if (isError) return;
            else {
                isError = true;
                console.log(error);
                if (fail) {
                    fail(error);
                } else if (error.message !== '登录已过期') {
                    Notification.error({
                        title: "错误",
                        message: translateError(error.message)
                    })
                }
                setTimeout(() => {
                    isError = false;
                }, 3000)
                if (afterResponse) {
                    setTimeout(() => {
                        afterResponse();
                    }, 500)
                }
            }
        });
    });
}

function translateError(errorMessage) {
    let message = errorMessage;
    if (errorMessage.match(/failed/ig)) {
        message = '链接服务器失败';
    } else if (errorMessage.match(/time/ig) && errorMessage.match(/out/ig)) {
        message = '请求超时';
    }
    return message;
}

