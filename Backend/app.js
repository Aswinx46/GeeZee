const express = require('express')
require('dotenv').config()
const app=express()
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const session=require('express-session')
const cors=require('cors')
mongoose.connect(process.env.MONGO_DB_KEY).then(()=>console.log("DB connected succesfully ")) 
const admin_route=require('./routes/adminRoute')
const user_route=require('./routes/userRoute')

const corsOptions = {
    origin:["http://localhost:5173","http://localhost:5174"],
    credentials: true, 
  };

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(
    session({
        secret:process.env.SESSION_KEY,
        resave:false,
        saveUninitialized: true,
        cookie:{
            secure: false,
            maxAge: 600000,
        }
    })
)
app.use('/',user_route)
app.use('/admin',admin_route)

app.listen(3000,()=>{
    console.log(' the server is listening')
})