import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null, // ✅ REQUIRED for BullMQ
});

redis.on("connect", () => {
    console.log("Redis Connected Successfully");
});

redis.on("error", (err) => {
    console.log(err);
})

redis.on("disconnect", () => {
    console.log("Redis Disconnected");
})

export default redis;