const mongoose = require('mongoose');
const connect_to_mongodb = ()=>{
    mongoose.connect(process.env.MONGOOSE_URI )
    .then(()=>{console.log("database connectd")})
    .catch(()=>{console.log("database connection failed");})
}

module.exports = {connect_to_mongodb , mongoose}