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

const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend-domain.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
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


let port = process.env.PORT || 5000

await dbConnection()

app.listen(port,()=>{
console.log(`Server is Running on http://localhost:${port}`)
});

export default app