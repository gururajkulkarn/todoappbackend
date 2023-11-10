const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    mobile:Number,
    email:String,
    dob:String,
    education:String,
    state:String,
    city:String
})

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel





