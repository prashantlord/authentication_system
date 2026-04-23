import {Worker} from "bullmq";
import sendEmail from "../../utils/send-email.js";
import redis from "../../config/redis.js";

const emailWorker = new Worker("email-queue", async (job) => {
    const {to, subject, templateName, data} = job.data;

    await sendEmail(to, subject, templateName, data);
}, {
    connection: redis, concurrency: 5
});

emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
});