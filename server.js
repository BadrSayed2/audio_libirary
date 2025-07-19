const express = require('express');
const dotenv = require('dotenv');
const profile_router = require('./routes/profile.routes');
const app = express()

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended : true}))
const DB = require('./config/mongodb.config');
const morgan = require('morgan');
const { info_logger } = require('./utils/logger.util');
const { info_logging } = require('./middlewares/logging.middlewate');


DB.connect_to_mongodb()

app.use(info_logging)

app.use('/uploads',express.static(__dirname +'/uploads'))
app.use('/api', require('./routes/auth.routes'));
app.use('/api/audio', require('./routes/audio.routes'));
// app.use('/api/admin', require('./routes/admin.routes'));

app.use('/api/profile',profile_router)

app.listen(4000, () => { console.log("welcome to mongo db server"); });
