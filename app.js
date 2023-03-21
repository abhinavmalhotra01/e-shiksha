import express, { urlencoded } from "express";
import {config} from "dotenv"
import ErrorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";


config({
    path:"./config/config.env"
});


const app = express()

// using middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended:true,
}))
app.use(cookieParser())

// importing and using routes
import course from "./routes/courseRoutes.js"
import user from './routes/userRoutes.js'
import payment from "./routes/paymentRoutes.js"
import dashboar from "./routes/dashboardRoutes.js"

app.use("/api/v1",course)
app.use("/api/v1",user)
app.use("/api/v1",payment)
app.use("/api/v1",dashboar)


export default app;

app.get("/",(req,res)=>res.send("<h1>server working</h1>"))
app.use(ErrorMiddleware)