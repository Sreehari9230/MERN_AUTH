import { MailtrapClient } from "mailtrap";

import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { MailTrapClient, sender, transporter } from "./mailtrap.config.js";

import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
    const recepient = [{ email }];
    try {
        // Send the email
        const info = await transporter.sendMail({
            from: `"Mern Auth" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email", // ✅ same subject as before
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        });

        console.log("✅ Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Error in sending email verification:", error);
        throw new Error(`Error in sending email verification: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recepient = [{ email }]
    try {
        // Send the email
        const info = await transporter.sendMail({
            from: `"Mern Auth" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email", // ✅ same subject as before
            html: WELCOME_EMAIL_TEMPLATE.replace("{username}", name),
        });

        console.log("✅ Welcome Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.log(`Error in sending  welcome email: ${error}`);
        throw new Error(`Error in sending welcome email: ${error}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recepient = [{ email }];
    try {
        // Send the email
        const info = await transporter.sendMail({
            from: `"Mern Auth" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        });

        console.log("Reset Password Email sent", info);

    } catch (error) {
        console.log(`Error in sending  reset password email: ${error}`);
        throw new Error(`Error in sending reset password email: ${error}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    const recepient = [{ email }];
    try {
        // Send the email
        const info = await transporter.sendMail({
            from: `"Mern Auth" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
        console.log("Password Reset Success Email Sent Successfully", info);

    } catch (error) {
        console.log(`Error in sending  password reset  success email: ${error}`);
        throw new Error(`Error in sending password reset   success email: ${error}`);
    }
};