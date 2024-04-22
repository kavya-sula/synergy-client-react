const { default: mongoose } = require("mongoose");

const signupdata=new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    mobileNumber:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,//num
        required: true
    },
    address:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    education:{
        type: String,
        required: true
    },

})
const user=mongoose.model("registeredDetails",signupdata);
module.exports=user;