import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
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
        })

        console.log("Email send Successfully", response);

    } catch (error) {
        console.log(`Error in sending email verificatin: ${error}`);
        
        throw new Error(`Error in sending email verificatin: ${error}`)
    }
}