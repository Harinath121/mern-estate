import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    username:{
        type :String,
        unique:true,
        required:true,
    },
    phonenumber:{
        type:Number,
        

    },
    email:{
        type :String,
        unique:true,
        required:true,
    },
    password:{
        type :String,
        
        required:true,
    },
    avatar:{
        type:String,
        default:"https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png",
    },
    
    

}, {timestamps :true});

const User= mongoose.model('User',userSchema);

export default User;