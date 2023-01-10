require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./route/auth')
mongoose.set("strictQuery", false)
const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mearn-learned.vjyenwm.mongodb.net/?retryWrites=true&w=majority`)
        console.log('MongoDB connected')
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}

connectDB()

const app = express()
app.use(express.json())

app.use('/api/auth', authRouter)



const PORT = 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
