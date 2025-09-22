import jwt from "jsonwebtoken"


export const generateTokenAndSetCookie = (res, userId) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",

    })

    res.cookie("token", token, {
        httpOnly: true, // coockie cannt be accessed by clinet side js alo aviod xxs attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //[revent csrs attck]
        maxAge: 7 * 24 * 60 * 60 * 1000, //7d

    })

    return token;
}