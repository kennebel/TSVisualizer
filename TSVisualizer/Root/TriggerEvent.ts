//interface ITriggerEvent<T> {
//    on(handler: { (data?: T): void });
//    off(handler: { (data?: T): void });
//}

///// <see cref="http://stackoverflow.com/a/14657922/2577071">
//class TriggerEvent<T> implements ITriggerEvent<T> {
//    private handlers: { (data?: T): void; }[] = [];

//    public on(handler: { (data?: T): void }) {
//        this.handlers.push(handler);
//    }

//    public off(handler: { (data?: T): void }) {
//        this.handlers = this.handlers.filter(h => h !== handler);
//    }

//    public trigger(data?: T) {
//        this.handlers.slice(0).forEach(h => h(data));
//    }
//}