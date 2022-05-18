const mongoose = require('mongoose')

const employeeSchema =new mongoose.Schema({
    displayName:{
        type:String,
        required:true,
        min: 6,
        max: 255
    },
    email:{
        type:String,
        required:true,
        min: 6,
        max: 255
    },
    address: {
        type:String,
        required:true,
        min: 5,
        max: 255
    },
    contact: {
        type:String,
        required:true,
        min: 10
    },
    password:{
        type:String,
        required:true,
        min: 8,
        max: 50
    },
    confirmPassword:{
        type:String,
        required:true,
        min: 8,
        max: 50
    }
})

module.exports = mongoose.model('employee-data',employeeSchema)