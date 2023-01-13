const express = require('express');
const router = express.Router()
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User')

router.get('/', (req, res) => res.send('USER ROUTE'))

// @route POST api/auth/register
// @desc Register user
// @access Public

router.post('/register', async (req, res) => {
    const {username, password} = req.body

    // Single Validation
    if(!username || !password)
    return res
    .status(400)
    .json({success: false, message: 'Missing username and/or password'})

    try{
        //check for existing user
        const user = await User.findOne({username: username})

        if(user)
        return res
        .status(400)
        .json({success: false, message: 'Username already in use'})

        // all good
        const hashPassword = await argon2.hash(password)
        const newUser = new User({username, password: hashPassword})
        await newUser.save()

        // return token
        const accessToken = jwt.sign({userId: newUser._id}, 
            process.env.ACCESS_TOKEN_SECRET)

        res.json({success: true, message:"User created successfully", accessToken})
    }catch(err){
        console.log(err)
        res.status(500).json({success: false, message:"Internal server error"})
    }
})


// @route POST api/auth/login
// @desc login user
// @access Public


router.post('/login', async(req, res) => {
    const {username, password} = req.body
    if(!username||!password)
    return res
        .status(400)
        .json({success: false, message: "Missing username and/or password!"})

    try{
        const user = await User.findOne({username});
        if(!user)    
        return res.status(400).json({success: false, message:"Username or password are incorrect!"})

        //username found!
        const passwordValid = await argon2.verify(user.password, password)
        if(!passwordValid)
        return res.status(400).json({success: false, message:"username or password are incorrect!"})

        //all good
        //return token
        const accessToken = jwt.sign({userId: user._id}, 
        process.env.ACCESS_TOKEN_SECRET)
        res.json({success: true, 
            message:"Login Success!", 
            accessToken
        })
    }catch(err){
        console.log(err)
        res.status(400).json({success: false, message:"Internal server error"})
    }
})
module.exports = router