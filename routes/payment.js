require("dotenv").config();
import express from 'express';
import crypto from 'crypto';
import uniquId from 'uniqid';
import request from 'request';
import Razorpay from 'razorpay';
 
import { SubcriptionModel } from '../models/subcription';


const Router = express.Router();

let orderId;

var instance = new Razorpay({
    key_id: process.env.RZP_KEY_ID,
    key_secret: process.env.RZP_SECRET_KEY,
})

//creating the order (checking out)
Router.get("/createorder/:amount", async(req,res)=>{ 
  try{
        const { amount } = req.params
        var options = {
        amount: amount * 100,
        currency:"INR",
        receipt: uniquId(),
        } 

        const order = await instance.orders.create(options)
        orderId = order.id
        return res.json(order)
  } catch(err){
    return res.status(422).json({error:err.message})
  }
})

//Order Verification
Router.post("/payment/callback", async(req,res)=>{
  try{
        const {razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const hash = crypto
          .createHmac("sha256", process.env.RZP_SECRET_KEY)
          .update(sign.toString())
          .digest("hex");
          
        if (razorpay_signature === hash) {
          
          const order = await SubcriptionModel.create({
            _id: razorpay_payment_id,
            orders: razorpay_order_id
          })
          await order.save()
          console.log("Verified")
          
          //res.redirect(`${process.env.FRONTEND}/payment/status/${razorpay_payment_id}`)
        res.status(200).json(razorpay_payment_id)
        } 
    
        else res.send("ERROR")
      } catch(err){
          return res.status(422).json({error:err.message})
      }
})
 
//verifying payment status
Router.get("/payments/:paymentId/:user_id", async(req, res) => {  
  try{
     
      const data = await SubcriptionModel.findById(req.params.paymentId)
      console.log(data)
      if (data == null) 
        return res.json({error: "No order Found"});
      request(
        `https://${process.env.RZP_KEY_ID}:${process.env.RZP_SECRET_KEY}@api.razorpay.com/v1/payments/${req.params.paymentId}`,
        async function (error, response, body) {
          if (body) {
            const result = JSON.parse(body)
            data.userid = req.params.user_id
            data.status = "Success"
            await data.save()
            res.status(200).json(result);
          }
          if(error)
          res.json({error:error.message})
        }
      )
  } catch(err){
    return res.status(422).json({error:err.message})
  }
})

export default Router;