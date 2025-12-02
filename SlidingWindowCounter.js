class SlidingWindowCounter {
    constructor(limit, windowLengthInMS) {
        this.limit = limit;
        this.windowLengthInMS = windowLengthInMS;
        this.data = new Map();
    }

    allow(key) {
        const now = Date.now();
        const windowStart = Math.floor(now / this.windowLengthInMS) * this.windowLengthInMS;

        let data = this.data.get(key);

        if (!data) {
            data = {
                current: 0,
                previous: 0,
                windowStart
            }
            this.data.set(key, data);
        }

        if (data.windowStart !== windowStart) {
            data.previous = data.current;
            data.current = 0;
            data.windowStart = windowStart;
        }


        const elapsed = now - windowStart;
        const fraction = (this.windowLengthInMS - elapsed) / this.windowLengthInMS;
        const estimated = data.current + data.previous * fraction; //taking only a portion of previous requests is what this is doing.

        if (estimated >= this.limit) {
            return false;
        }

        data.current++;
        return true
    }
}

const limiter = new SlidingWindowCounter(5, 10000);

setInterval(() => {
    const allowed = limiter.allow("user123");
    console.log("request:", allowed ? "OK" : "BLOCKED");
}, 1000);
