const redis = require('redis');
const { error_logger } = require('../utils/logger.util');
const redis_client = redis.createClient()

redis_client.connect().then(()=>{
    console.log("reddis server connected");
}).catch((e)=>{
    console.log(e.message);
    
})

redis_client.on('error',(e)=>{
    error_logger.error("error log :" + e.message)
})

module.exports = redis_client