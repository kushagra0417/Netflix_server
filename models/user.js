import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const {ObjectId} = mongoose.Schema.Types

const UserSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String
    },
    phoneNumber:{
        type: Number
    },
    dob:{
        type: Date
    },
    friends:[{
        trim: true,
        type: String
    }],
    profilePic:{
        type: String,
        default: "https://res.cloudinary.com/netflixclone56789/image/upload/v1622581918/no-image_yntmex.jpg"
    },
    saved:[{
        type: ObjectId,
        ref: "Content"
    }],
    dateCreated:{
        type: Date,
        default: Date.now()
    },
    resetToken: String,
    expireToken: Date,
})

// this code should be inserted in user.js (model)
UserSchema.statics.existingUser = async function (email){

    const user = await UserModel.findOne({email})
    if(user)
    throw new Error("User already exists!")
    return false
}

//file path:model/User.js
UserSchema.statics.findByEmailAndPassword = async function (email,password){
    const user = await UserModel.findOne({email})
    if(!user)
    throw new Error("Email doesn't exist!")
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch)
    throw new Error("Invalid email or password")
    return user
}

//npm i jsonwebtoken in server folder
//file path:model/User.js
//this is import make in the top
UserSchema.methods.generateToken = function(){
    return jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET)
}

//file path:model/User.js
UserSchema.statics.findByEmail = async function (email){
    const user = await UserModel.findOne({email})
    if(!user)
    throw new Error("Email doesn't exist!")
    return user
}

//filepathRef:model/user.js
UserSchema.statics.resetSession = async function (sentToken, newPassword){
    const user = await UserModel.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    console.log(user,sentToken)
    if(user==null){
    throw new Error("Session Expired. Please try again.")
    }
    console.log("HELLO")
    const hashedpassword= await bcrypt.hash(newPassword,12)
    console.log("BRO")
    user.password=hashedpassword
    user.resetToken=undefined
    user.expireToken=undefined
    user.save()    
    return user
}
export const UserModel = mongoose.model("Users", UserSchema);