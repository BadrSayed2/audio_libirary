const { mongoose } = require("../config/mongodb.config")

const user_schema = new mongoose.Schema({
  name : {
    type:  String,
    required: true,
    minlength: 2,
  },
  password :  {
    type:  String,
    required: true,
  },
  email :  {
    type:  String,
    required: true},
  role : {
    type:  String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  },
  profile_pic :  String
  
});

const user_model = mongoose.model('User' , user_schema)

module.exports = user_model