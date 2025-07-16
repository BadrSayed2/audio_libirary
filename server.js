
const express = require('express');

const app = express()
const dotenv = require('dotenv')
const DB = require('./config/mongodb.config')

const DB_connect = DB.connect_to_mongodb
const mongoose = DB.mongoose

app.use(express.json())
dotenv.config();

DB_connect()


app.listen(4000 , ()=>{console.log("welcome to mongo db server")})