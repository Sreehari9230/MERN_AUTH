import crypto from "crypto";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";


export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("all fields are required");
        }
        const userAlreadyExists = await User.findOne({ email })
        if (userAlreadyExists) {
            throw new Error("user already excits");
            // return res.status(400).json({success:false, message:"user already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(10000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24hr
        });
        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id);

        // send verification emai
        sendVerificationEmail(user.email, verificationToken);
        res.status(201).json({
            success: true, message: "user created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, mesaage: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(500).json({ success: false, message: "Invalid Verification Code" })
        }
        user.isVerified = true;
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined

        await user.save();

        await sendWelcomeEmail(user.email, user.name)

        return res.status(200).json({
            success: true, message: "Email Verifided and Welcome Email Send", user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Error in VerifyEmail");
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "invalid vredentisla" })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "invalid vredentisla" })
        }

        generateTokenAndSetCookie(res, user._id)

        user.lastLogin = Date.now();
        await user.save()

        res.status(200).json({
            success: true, message: "user succesfully loggedin", user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("error in logincn");

        return res.status(500).json({ success: false, message: error.message })

    }
};
export const logout = async (req, res) => {
    res.clearCookie("token")
    return res.status(200).json({ success: true, message: "Logged out Successfully" })
};
export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" })
        }
        // generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //one hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save();

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success: true, message: "Password rest lonk sent",
        })
    } catch (error) {
        console.log("error in forgotPassword");
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt:{$gt: Date.now()}
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "invalid or expired reset token" })

        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);


        user.password = hashedPassword;
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save();

        await sendResetSuccessEmail(user.email)
        return res.status(200).json({ success: true, message: "Password reseted successfully" })

    } catch (error) {
        console.log("error in resetPassword");
        return res.status(400).json({ success: false, message: error.mesaage })
    }
}