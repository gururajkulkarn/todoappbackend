const mongoose = require('mongoose')

const RegisterSchema = new mongoose.Schema({
    fname:String,
    email:String,
    password:String
})

const RegisterModel = mongoose.model("registers", RegisterSchema)
module.exports = RegisterModel





