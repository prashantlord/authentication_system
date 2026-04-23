import connectMongoDb from "./config/db.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const MONGO_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

connectMongoDb(MONGO_URI);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})