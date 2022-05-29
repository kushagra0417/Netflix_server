import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema.Types

const SubscriptionSchema = new mongoose.Schema({
    _id: {
        type: String,
      },
      orders: {
        type: Array,
        default: [],
      },
      userid :{
          type: ObjectId,
          ref: "User"
      },
      expiry: {
        type: Date,
        default: +new Date() + 30*24*60*60*1000
      },
      status:{
        type: String,
        default: "Failed"
      }
})

export const SubcriptionModel = mongoose.model("subcription",SubscriptionSchema);