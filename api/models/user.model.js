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
        default:"https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgHaHw?rs=1&pid=ImgDetMain",
    },
    
    

}, {timestamps :true});

const User= mongoose.model('User',userSchema);

export default User;