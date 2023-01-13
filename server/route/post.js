const express = require('express')
const router = express.Router()

const Post = require('../models/Post')

//@route POST api/posts
//@desc create post
//@access private

router.post('/', async (req, res) => {
    const { title, description, url, status } = req.body

    //Simple validation
    if (!title)
        return res
        .status(400)
        .json({ success: false, message: "Title is required" })

    try {
        const newPost = new Post({ 
            title, 
            description, 
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status||'TO LEARN',
            user: '63bd7c2c850a1e5b8ee1d9c1'
        })

        await newPost.save()

        res.json({ success: true, message:"Happy Learning :))", post: newPost})
    } catch (err) {
        console.log(err)
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
})

module.exports = router