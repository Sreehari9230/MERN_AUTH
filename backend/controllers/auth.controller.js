import { generateKey } from "crypto"
import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"

export const signup = async (req, res) => {

    const { email, password, name } = req.body
    try {
        if (!email || !password || !name) {
            throw new Error("allfields are required")
        }

        const userAlreadyexist = await User.findOne({ email })

        if (userAlreadyexist) {
            throw new Error("user already excits")
            // return res.status(400).json({success:false, message:"user already excists"})
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(10000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24hr
        })

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id)

        res.status(201).json({
            success: true, message: "usercerated sucesfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(400).json({ success: false, mesaage: error.message })
    }
}
export const login = async (req, res) => {
    res.send("login")
}
export const logout = async (req, res) => {
    res.send("login")
}