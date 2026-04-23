import express from 'express';
import apiRoutes from "./routes/index.js";

import errorMiddleware from "./middleware/error.middleware.js";
import transporter from "./config/mailer.js";

const app = express();

if (process.env.NODE_ENV === "development") {
    transporter.verify()
        .then(() => console.log("Mailer is ready"))
        .catch((err) => console.error("Mailer setup failed:", err.message));
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.use(errorMiddleware);

export default app;