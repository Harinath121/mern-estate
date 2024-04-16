import express from "express";
import  mongoose from "mongoose";
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config(); 



//env is a protected file where we'll place is sensitive data such that when we upload the folder that file wont be shared
//we need to insall npm i dotenv

 
mongoose.connect(process.env.MONGO).then(()=>{ console.log("connect to MongoDb")}).catch((err)=>{console.log(err)});

const app= express();

app.use(cors());
app.use(cookieParser());


app.listen(3000,()=>{
    console.log("Backend running on 3000");
})    

app.use(express.json()); // to the req in the form of json

app.use('/api/user',userRouter); // router from user.route.js is imported as userRouter

app.use('/api/auth',authRouter);



//below app.use act as a middleware for error handeling.
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message=err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
})