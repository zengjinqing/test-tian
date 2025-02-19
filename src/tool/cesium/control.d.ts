export default class EventListenControl {
    on(evt, callback: Function):void
    emit(evt, ...arg: any[]):void
    remove(evt, callback: Function):void
    listen(evt, callback: Function):void
    emitKeys(keys:string[]):void
}