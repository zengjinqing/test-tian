export default class EventListenControl {
    on(evt, callback: Function)
    emit(evt, ...arg: any[])
    remove(evt, callback: Function)
    listen(evt, callback: Function)
    emitKeys(keys:string[])
}