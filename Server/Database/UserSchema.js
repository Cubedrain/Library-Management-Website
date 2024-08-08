const mongoose = require('mongoose'),
    {Schema} = mongoose

const userSchema = new Schema({
    id:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    displayName:{
        type:String,
        required:true
    },password:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('local users',userSchema)