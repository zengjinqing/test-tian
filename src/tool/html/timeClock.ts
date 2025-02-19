// 设置时间响应式对象
export function setNowTime(time:any) {
    const date = new Date();
    time.year = date.getFullYear();
    time.month = date.getMonth() > 9 ? date.getMonth() : ("0" + date.getMonth());
    time.date = date.getDay() > 9 ? date.getDay() : ("0" + date.getDay());
    time.hour = date.getHours() > 9 ? date.getHours() : ("0" + date.getHours());
    time.minute = date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes());
    time.second = date.getSeconds() > 9 ? date.getSeconds() : ("0" + date.getSeconds());
    const day = date.getDay();
    switch (day) {
        case 1:
            time.day = "星期一"
            break;
        case 2:
            time.day = "星期二"
            break;
        case 3:
            time.day = "星期三"
            break;
        case 4:
            time.day = "星期四"
            break;
        case 5:
            time.day = "星期五"
            break;
        case 6:
            time.day = "星期六"
            break;
        case 0:
            time.day = "星期日"
            break;

        default:
            break;
    }
}