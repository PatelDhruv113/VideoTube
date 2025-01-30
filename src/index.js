// require('dotenv').config({path: './env'})    //imroved version below for maintain consistency
import dotenv from "dotenv"    // variable all file ma spread kare

import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path: './env'
})


connectDB()
.then(() => {
     app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is runing at port : ${process.env.PORT}`)
     })
})
.catch((error) => {
    console.log("MOMGODB connection failed !!! ", error)
})













/*
import express from "express"
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";


const app = express()

( async () => {
    try {
        await mongoose.conect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        
        app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listing on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.log("ERROR: ", error)

    }
})()

*/