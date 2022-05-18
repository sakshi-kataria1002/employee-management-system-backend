const Joi = require('@hapi/joi')
const adminModel = require('../model/adminModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const employeeModel = require('../model/employeeModel')

exports.signUp = async (req,res) =>{
    const emailExist = await adminModel.findOne({email:req.body.email})

    if(emailExist){
        res.status(400).send('Email already exists')
        return;
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt)
    const hashedConfirmPassword = await bcrypt.hash(req.body.confirmPassword,salt)

    try {
        const registrationSchema = Joi.object({
            displayName: Joi.string().min(3).required(),
            email: Joi.string().min(3).required().email(),
            address: Joi.string().min(5).required(),
            contact: Joi.string().min(10).required(),
            password: Joi.string().min(8).required(),
            confirmPassword: Joi.string().min(8).required()
        })

        const {error} = await registrationSchema.validateAsync(req.body)

        if(error) {
            res.status(400).send(error.details[0].message)
            return;
        }else {
            if(hashedPassword === hashedConfirmPassword){
                const user = new adminModel({
                    displayName:req.body.displayName,
                    email:req.body.email,
                    address:req.body.address,
                    contact:req.body.contact,
                    password: hashedPassword,
                    confirmPassword: hashedConfirmPassword
                })
        
                const saveUser = await user.save()
                res.status(200).send("User Created Successfully")
            }else {
                res.send("Password not matching")
            }
        }
    }catch (error) {
        res.status(500).send(error)
    }
}

exports.signIn = async (req,res) =>{
    const user = await adminModel.findOne({email:req.body.email})

    if(!user) return res.status(400).send('Please SignUp First')

    const validatePassword = await bcrypt.compare(req.body.password, user.password)
    if(!validatePassword) return res.status(400).send('Incorrect Password')
    
    try {
        const loginSchema = Joi.object({
            email: Joi.string().min(3).required().email(),
            password: Joi.string().min(8).required()
        })

        const {error} = await loginSchema.validateAsync(req.body)

        if(error) return res.status(400).send(error.details[0].message)
        else{
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
            
            res.header("auth-token", token).send(token)
            //res.send("Logged in successfully")
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.adminEmployeeSignup = async (req,res) =>{
    const emailExist = await employeeModel.findOne({email:req.body.email})

    if(emailExist){
        res.status(400).send('Employee already exists')
        return;
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt)

    const employeeUser = new employeeModel({
        displayName: req.body.displayName,
        email: req.body.email,
        address: req.body.address,
        contact: req.body.contact,
        password: hashedPassword,
        confirmPassword: hashedPassword
    })

    try {
        const employeeSchema = Joi.object({
            displayName: Joi.string().min(3).required(),
            email: Joi.string().min(3).required().email(),
            address: Joi.string().min(3).required(),
            contact: Joi.string().min(3).required(),
            password: Joi.string().min(8).required(),
            confirmPassword: Joi.string().min(8).required()
        })

        const {error} = await employeeSchema.validateAsync(req.body)

        if(error) {
            res.status(400).send(error.details[0].message)
            return;
        }
            const saveAdmin = await employeeUser.save()
            res.status(200).send("Employee Created Successfully")
        } catch (error) {
        res.status(500).send(error)
    }
}

// exports.getAllUsers = async (req,res) => {
//     const allUsers = await adminModel.find()
//     try{
//         res.status(200).send(allUsers)
//     }catch(error){
//         res.status(500).send(error)
//     }
// }

