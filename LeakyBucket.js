class LeakyBucketLimiter {
    constructor(capacity, drainRatePerMs) {
        this.capacity = capacity;
        this.drainRate = drainRatePerMs;
        this.buckets = new Map();
    }

    _getBucket(key, now) {
        let bucket = this.buckets.get(key);
        if (!bucket) {
            bucket = {
                backlog: 0,
                lastTick: now
            }
            this.buckets.set(key, bucket);
        }
        return bucket;
    }

    allow(key, cost = 1) {
        const now = Date.now();
        const bucket = this._getBucket(key, now);
        const elapsed = Math.max(0, now - bucket.lastTick);
        const drained = elapsed * this.drainRate;
        bucket.backlog = Math.max(0, bucket.backlog - drained);
        bucket.lastTick = now;

        if (bucket.backlog + cost <= this.capacity) {
            bucket.backlog += cost;
            return { allowed: true, backlog: bucket.backlog, retryAfterMs: null };
        }

        const needed = (bucket.backlog + cost) - this.capacity;
        const retryAfterMs = Math.ceil(needed / this.drainRate);
        return { allowed: false, backlog: bucket.backlog, retryAfterMs };
    }

    cleanup() {
        for (const [key, value] of this.buckets) {
            if (value.backlog === 0) this.buckets.delete(key);
        }
    }
}


const limiter = new LeakyBucketLimiter(10, 2 / 1000);

const now = Date.now();
for (let i = 0; i < 5; i++) {
    console.log(limiter.allow('user1', 1));
}

for (let i = 0; i < 20; i++) {
    const res = limiter.allow('user2', 1);
    console.log(i, res);
}