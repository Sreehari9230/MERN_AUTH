import { MailtrapClient } from "mailtrap";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { MailTrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recepient = [{ email }];

    try {
        const response = await MailTrapClient.send({
            from: sender,
            to: recepient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });

        console.log("Email send Successfully", response);

    } catch (error) {
        console.log(`Error in sending email verificatin: ${error}`);
        throw new Error(`Error in sending email verificatin: ${error}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recepient = [{ email }]

    try {
        const response = await MailTrapClient.send({
            from: sender,
            to: recepient,
            template_uuid: "32117fe5-e7d6-419f-8655-b2dc62dc1567",
            template_variables: {
                "company_info_name": "Mern Auth",
                "name": name
            }
        })
        console.log("Welcome Email Send Successfully", response);

    } catch (error) {
        console.log(`Error in sending  welcome email: ${error}`);
        throw new Error(`Error in sending velcome email: ${error}`);

    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recepient = [{ email }];
    try {
        const response = await MailTrapClient.send({
            from: sender,
            to: recepient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",

        })
        console.log("Reset Password Email sent", response);

    } catch (error) {
        console.log(`Error in sending  reset password email: ${error}`);
        throw new Error(`Error in sending reset password email: ${error}`);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recepient = [{ email }]
    try {
        const response = await MailTrapClient.send({
            from: sender,
            to: recepient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",

        })
        console.log("Password resent success email send succes", response);

    } catch (error) {
        console.log(`Error in sending  reset password  success email: ${error}`);
        throw new Error(`Error in sending reset password  success email: ${error}`);
    }
}