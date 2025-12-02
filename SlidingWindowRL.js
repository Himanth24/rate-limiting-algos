class SlidingWindow {
    constructor(limit, windowLengthInMS) {
        this.limit = limit;
        this.windowLengthInMS = windowLengthInMS;
        this.logs = new Map();
    }

    allow(key) {
        const now = Date.now();
        const windowStart = now - this.windowLengthInMS;

        if (!this.logs.has(key)) {
            this.logs.set(key, []);
        }

        const timestamps = this.logs.get(key);

        while (timestamps.length && timestamps[0] < windowStart) {
            timestamps.shift();
        }

        if (timestamps.length >= this.limit) {
            return false;
        }

        timestamps.push(now);
        console.log(timestamps);
        return true;
    }
}



const limiter = new SlidingWindow(5, 10000);

setInterval(() => {
    const allowed = limiter.allow("user123");
    console.log(allowed ? "OK" : "BLOCKED");
}, 1000);