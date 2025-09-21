import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js"

dotenv.config();

const app = express();
// env ||
app.get("/", (req,res)=>{
    res.send("Hello World")
})

app.use("/api/auth", authRoutes)

app.listen(5000, () => {
    connectDB();
    console.log("server is running on port 3000");
})
// env port

 