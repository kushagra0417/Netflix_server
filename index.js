require("dotenv").config();
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';

require ("dotenv").config();

import user from './routes/auth'
import profiles from './routes/profile';
import paymentRoute from './routes/payment';

const app = express();

app.use(express.json())
app.use(cors());



mongoose.connect(process.env.MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(() => {
console.log("Mongodb is connected")
})
.catch((err)=>{
    console.log(err)
})
mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB")
})
mongoose.connection.on('error',()=>{
    console.log("err connecting")
})

app.use('/', user)
app.use('/', profiles);
app.use('/',paymentRoute);

app.listen(process.env.PORT || 7000,()=>{
    console.log("server is running in the port 7000");
})