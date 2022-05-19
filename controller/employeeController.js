const Joi = require('@hapi/joi')
const employeeModel = require('../model/employeeModel')
const bcrypt = require('bcryptjs')

exports.signUp = async (req,res) =>{
    const emailExist = await employeeModel.findOne({email:req.body.email})

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
                const user = new employeeModel({
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
    const user = await employeeModel.findOne({email:req.body.email})

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
            //const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
            
            //res.header("auth-token", token).send(token)
            res.send(user)
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getAllUsers = async (req,res) => {
    const allUsers = await employeeModel.find()
    try{
        res.status(200).send(allUsers)
    }catch(error){
        res.status(500).send(error)
    }
}

exports.deleteEmployee = async (req,res) =>{
    const delete_Employee = await employeeModel.deleteOne({_id:req.params.id})
    try {
        res.send(`Successfully deleted employee: ${req.params.id}`)
    } catch (error) {
        res.send(error)
    }
}

exports.editEmployee = (req,res) =>{
    employeeModel.findById(req.params.id , (error, employee)=>{
        if(error)
        res.send(error)
        employee.displayName = req.body.displayName ? req.body.displayName : employee.displayName
        employee.email = req.body.email ? req.body.email : employee.email
        employee.address = req.body.address ? req.body.address : employee.address
        employee.contact = req.body.contact ? req.body.contact : employee.contact
        
        employee.save((error) => {
            if(error)
            res.send(error)
            res.json({
                data: employee,
                message: "Details Updated Successfully"
            })
        })
    })
}
