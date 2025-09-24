import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
export const transporter = nodemailer.createTransport({
    service: "gmail",  // or use host/port if needed
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});