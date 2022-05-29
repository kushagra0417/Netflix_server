import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';//at the top NO need to install inbuilt in nodejs just import to use
import { UserModel } from '../models/user'
import { SubcriptionModel } from '../models/subcription';

import { signUpEmail,resetPswdEmail } from '../emailing';
import {  validateSignUp,validateSignIn, validateUserEmail,validateUserPassword } from '../validationSchemas/userValidation'


const Router = express.Router();

Router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body
        await validateSignUp(name, email, password)
        await UserModel.existingUser(email)
        const hashedpassword = await bcrypt.hash(password, 12)
        const user = await UserModel.create({ email, password: hashedpassword, name, friends: [name] })
        signUpEmail(email)
        // await user.save()
        const token = user.generateToken()
        return res.json({ message: "Saved successfully", user,token })

    } catch (err) {
        return res.status(422).json({ error: err.message })
    }
})

Router.post('/signin',async(req,res)=>{
    try{
        const{ email, password } = req.body 
        await validateSignIn(email, password)
        const savedUser = await UserModel.findByEmailAndPassword(email,password)
        const validSubs = await SubcriptionModel.findOne({userid:savedUser._id})
        console.log(validSubs)
        const token = savedUser.generateToken()
        if(validSubs == null || validSubs.expiry < Date.now())
        return res.status(422).json({error: "Please subscribe to a plan first!",token,savedUser })
        return res.json({message:"Successfully signed in",token,savedUser})
    }catch(err){
        return res.status(422).json({error:err.message})
    }     
})
Router.post("/resetpassword",async(req,res)=>{
    const {email}=req.body
    await validateUserEmail(email)
    crypto.randomBytes(32,async (err,buffer)=>{
        try{
            if(err) console.log(err)
            const token = buffer.toString("hex")
            console.log(token)
            const user = await UserModel.findByEmail(email)
            user.resetToken = token
            user.expireToken = Date.now()+3600000
            await user.save()
          resetPswdEmail(user,token)
            return res.json({message:"Check your email",token,user})
        }catch(err){
            return res.status(422).json({error:err.message})
        }
    })
})

//filepathRef:routes/auth.js
Router.post("/newpassword",async(req,res)=>{
    try{
        const { newPassword, sentToken } = req.body
        console.log("inside",sentToken)
        await validateUserPassword(newPassword)
        
        const user = await UserModel.resetSession(sentToken, newPassword)
        
        return res.json({message:"Password Updated Succesfully",user})
    }catch(err){
        return res.status(422).json({error:err.message})
    }
})
export default Router;