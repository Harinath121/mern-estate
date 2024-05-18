import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js'
import { errorHandler } from '../../utils/error.js';
import Listing from '../models/listing.model.js';


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

export const deleteUser = async (req,res,next)=>{
    if(req.user.id!=req.params.id) return next(errorHandler($01,"you can only delete your account"));

    try{
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token'); 
        res.status(200).json('User has been Deleted');
    } catch(error){
        next(error);
    }

}


export const getUserListings = async(req,res,next)=>{

    if(req.user.id!==req.params.id) return next(errorHandler(401,"you can only view your listings "));

    try{

        const listings = await Listing.find({userRef:req.params.id});

        res.status(200).json(listings);

    }catch(err){
        next(err);
    }



}

export const getUser = async (req,res,next)=>{
    try{
        const user = await User.findById(req.params.id);
    
        if(!user){
            return next(errorHandler(404,'user  not found'));
        }
    
        const {password:pass,...rest}=user._doc;
    
        res.status(200).json(user);

    }catch(err){
        next(err);
    }
}