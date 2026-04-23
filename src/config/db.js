import mongoose from 'mongoose';

export default async function connectMongoDb(uri) {
    mongoose.connection.on("connected", () => {
        console.log("MongoDB Connected");
    });

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB Disconnected");
    });

    try {
        await mongoose.connect(uri);
    } catch (err) {
        console.error("Initial MongoDB Connection Failed:", err);
    }
}