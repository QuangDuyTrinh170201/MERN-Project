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

module.exports = router