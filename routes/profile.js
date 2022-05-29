//filepathRef:routes/profile.js
import express from 'express';

import { UserModel } from '../models/user'
import requireLogin from '../middlewares/requireLogin'


const Router = express.Router();


Router.get('/allfriends', requireLogin, async(req,res)=>{
    try{
        const user = await UserModel.findById({_id:req.user._id})
        console.log(user)
        res.json(user)

    }catch(err){
        return res.status(422).json({error:err.message})
    }
})

//filepathRef:routes/profile.js
Router.put('/createfriendprofiles', requireLogin, async ( req, res )=>{ 
    const { friend, _id } = req.body
    const user = await UserModel.findById(_id)
    user.friends.push(friend)
    user.save()
    res.json(user)
})


//filepathRef:routes/profile.js
Router.put("/deletefriendprofiles",requireLogin,(req,res)=>{
    const { item, _id } = req.body
    const name = item;
    console.log("HI",name)
    UserModel.findByIdAndUpdate(_id,{
        $pull:{friends: name}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
        return res.status(422).json({error:err})
        else 
        res.json(result)

    })
})

export default Router;