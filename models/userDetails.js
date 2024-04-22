const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({

    userName:{
        type:String,
    },
    age:{
        type:Number,
    },
    email:{
        type:String,
        required: true,
        unique: true,

    }
});

const userlist= mongoose.model(`users`,userSchema);
module.exports=userlist;