import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from 'cors';
import dbConnection from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import orderRouter from "./routes/order.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use('/auth/api/v1',authRouter);
app.use('/user/api/v1', userRouter);
app.use('/admin/api/v1', adminRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/order", orderRouter);




app.get('/',(req,res)=>{
  res.send("hello Affilio")
});

// console.log("ACCESS:", process.env.ACCESS_TOKEN_SECRET);
// console.log("REFRESH:", process.env.REFRESH_TOKEN_SECRET);

let port = process.env.PORT || 5000

dbConnection()

app.listen(port,()=>{
console.log(`Server is Running on http://localhost:${port}`)
});

export default app