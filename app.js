require('dotenv').config()
const blogRouter = require('./controllers/blogs')
const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)

module.exports = app
