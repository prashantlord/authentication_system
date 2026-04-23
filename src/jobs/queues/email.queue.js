import {Queue} from "bullmq";
import redis from "../../config/redis.js";

const emailQueue = new Queue("email-queue", {connection: redis});

export function sendEmailJob(to, subject, templateName, data) {
    emailQueue.add("send-email", {to, subject, templateName, data}, {
        attempts: 3, backoff: {
            type: "exponential", delay: 5000,
        }, removeOnComplete: true, removeOnFail: true,
    });
}