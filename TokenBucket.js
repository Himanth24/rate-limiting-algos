class TokenBucketLimiter {
    constructor(capacity, refillRatePerMS) {
        this.capacity = capacity;
        this.refillRatePerMS = refillRatePerMS;
        this.buckets = new Map();
    }

    _getBucket(key, now) {
        let bucket = this.buckets.get(key);
        if (!bucket) {
            bucket = {
                tokens: this.capacity,
                lastRefill: now
            };
            this.buckets.set(key, bucket);
        }
        return bucket;
    }

    allow(key, cost = 1) {
        const now = Date.now()
        const bucket = this._getBucket(key, now);

        const delta = now - bucket.lastRefill;
        const refill = delta * this.refillRatePerMS;
        bucket.tokens = Math.min(this.capacity, bucket.tokens + refill);
        bucket.lastRefill = now;

        console.log(delta, "--------", refill);

        if (bucket.tokens >= cost) {
            bucket.tokens -= cost;
            return true;
        }
        return false;
    }
}



const limiter = new TokenBucketLimiter(5, 1 / 2000);

setInterval(() => {
    console.log("userA:", limiter.allow("userA") ? "OK" : "BLOCKED");
}, 1000);
