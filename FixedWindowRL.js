class FixedWindow {
    constructor(limit, windowLengthInMS) {
        this.limit = limit;
        this.windowLengthInMS = windowLengthInMS;
        this.counters = new Map();
    }

    allow(key) {
        const now = Date.now();
        console.log(now, "---", this.windowLengthInMS);
        //when we start is irrelevant and it is always going to follow exact ex: 11:12 to 11:13 even if started at 11:36
        const windowStart = Math.floor(now / this.windowLengthInMS) * this.windowLengthInMS;

        let data = this.counters.get(key);
        if (!data || data.windowStart !== windowStart) {
            data = { count: 0, windowStart };
            this.counters.set(key, data);
        }

        if (data.count >= this.limit) {
            return false;
        }

        data.count += 1;
        return true;
    }
}

const limiter = new FixedWindow(5, 60000);

setInterval(() => {
    const allowed = limiter.allow("user123");
    console.log("request from user123:", allowed ? "OK" : "BLOCKED");
}, 1000);

setInterval(() => {
    const allowed = limiter.allow("user1234");
    console.log("request from user1234:", allowed ? "OK" : "BLOCKED");
}, 1000);