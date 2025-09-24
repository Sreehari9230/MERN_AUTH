import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

export const MailTrapClient = new MailtrapClient({
    endpoint: ENDPOINT,
    token: TOKEN,
});

export const sender = {
    email: "hello@demomailtrap.co",
    name: "Mern Auth",
};

// import dotenv from "dotenv";

// dotenv.config();

// Create transporter
export const transporter = nodemailer.createTransport({
    service: "gmail",  // or use host/port if needed
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});



// const recipients = [
//     {
//         email: "sreeharimangalasseri528@gmail.com",
//     }
// ];

// client
//     .send({
//         from: sender,
//         to: recipients,
//         subject: "You are awesome!",
//         text: "Congrats for sending test email with Mailtrap!",
//         category: "Integration Test",
//     })
//     .then(console.log, console.error);


