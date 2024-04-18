import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js'
import { errorHandler } from '../../utils/error.js';


export  const test= ((req,res)=>{
    res.send("hello world");
});


export const updateUser = async (req,res,next)=>{

    if(req.user.id!=req.params.id) return next(errorHandler(401,"you can update only your profile "));
    try{
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10)
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            //set is used to update the date ie, like same as setState
                //follow thw individual assisgning way not the whole data as user might not update all the data same time 
                //better to practise in this way.
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar,
                phonenumber:req.body.phonenumber

            }
        },{new:true})  ;   //new :true returns the new updated data,iff this not mention then old data will be passed
        
        const {password,...rest} = updateUser._doc;

        res.status(200).json(rest);
    
    }catch(error){
        next(error)
    }

};
