import { errorHandler } from "../../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

import jwt from "jsonwebtoken"; // used create a cookie such that when user logins it stores the data  as cookie and helps in further need,also provides protection

// signup authentication #creation and storing
export const signup = async (req,res,next)=>{
    const {username,phonenumber,email,password}=req.body;
    const hashedPassword = bcryptjs.hashSync(password,10); //hashSync act as await for bcryptjs to make a hashed password.
    const newUser = new User({username,phonenumber,email,password : hashedPassword}); //creates a user using user model.
    try{
        await newUser.save(); //stores the data but it takes a bit time hence we use await function give requires time.
        res.status(201).json("Sucessfully created");
    }catch(error){
        next(error);  //using next we call middleware.check in index.js
    }

};


// signin authentication

export const signin = async(req,res,next)=>{
    const {email,password}=req.body;
    try{
        const validUser = await User.findOne({email:email});
        if(!validUser) return next(errorHandler(404,'User not found'));
        const validPassword =bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'Invalid credentials'));
        

        //token stores the user data as hashed and helps in authentication like when user wants to update or perform some action it checks wheather the person is properly logged in or not 
        //token can be expires within in a time the web asks to signin again
        //token in held in web cookie

        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)
        
        const {password:pass,...rest} = validUser._doc;
        //destructiong of user data such that we seperate password and remaining and we only get the userdata without pass when signedin.
        //passed in .json(rest);


        res.cookie('access_token',token,{hhtpOnly :true}).status(200).json(rest);
        //res.cookie('access_token',token,{hhtpOnly :true, expires:30m}).status(200).json(validUser) this makes token to expire in 30mins.
        
    }
    catch(error){
        next(error);
    }
}


//while signing up using googlr
export const google = async(req,res,next)=>{
    try{

        const user= await User.findOne({email: req.body.email})
        if(user){

            const token=jwt.sign({id:user._id},process.env.JWT_SECRET) //line 33
        
            const {password:pass,...rest} = user._doc;

            res.cookie('access_token',token,{hhtpOnly :true}).status(200).json(rest);

        }else{

            //As we are using google to signup we dont ask any password from user but we declared it as require in model hence we need to 
            // create a password to overcome the issuee so generate a random password.
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);  //16char pass
            

            //rendom give a random number .string converts into string containing numer and allphabets .slice give last 8 characters
            //ex:0.8654fdgh 

            const hashedPassword = bcryptjs.hashSync(generatedPassword,10); 

            
            const newUser = new User({username : req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),phonenumber:req.body.phonenumber,email:req.body.email,password : hashedPassword,avatar :req.body.photo}); //creates a user using user model.
            await newUser.save();
            console.log("user through google :" ,newUser);

            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET) //line 33
        
            const {password:pass,...rest} = newUser._doc;

            res.cookie('access_token',token,{hhtpOnly :true}).status(200).json(rest);


        }

    }
    catch(error){
        next(error);
    }
}

export const signOut=(req,res,next)=>{
    try{
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out');
    }catch(error){
        next(error);
    }
}