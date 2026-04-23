import transporter from "../config/mailer.js";
import path from "path";
import {fileURLToPath} from "url";
import ejs from "ejs";

export default async (to, subject, templateName, data) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const templatePath = path.join(
            __dirname,
            "../email/templates",
            `${templateName}.ejs`
        );

        // render EJS to HTML
        const html = await ejs.renderFile(templatePath, data);

        const mailOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            to,
            subject,
            html,
        };

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email error:", error);
        throw error;
    }
};