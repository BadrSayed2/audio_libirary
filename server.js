const express = require('express');
const dotenv = require('dotenv');
const DB = require('./config/mongodb.config');

const app = express();
dotenv.config();

DB.connect_to_mongodb();

app.use(express.json());

app.use('/api', require('./routes/auth.routes'));
app.use('/api/audio', require('./routes/audio.routes'));
app.use('/api/admin', require('./routes/admin.routes'));



app.listen(4000, () => { console.log("welcome to mongo db server"); });
