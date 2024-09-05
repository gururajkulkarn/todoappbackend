const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    mname:String,
    title:String,
    descri:String,
    deadline:String
})

const TaskModel = mongoose.model("tasks", TaskSchema)
module.exports = TaskModel





