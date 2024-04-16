import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken=(req,res,next)=>{
    const token=req.cookies.access_token; // this fetches the current tokken which is stored in the web

    if(!token) return next(errorHandler(401,"Unauthorized")); // if token is null which means user is not loggied in or maybe session might be timedout
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{ //to chec the token from web and user tooken is same or not
        if(err) return next(errorHandler(403,'Forbidden'));
        req.user = user;
        next();
    });

}