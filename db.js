const mongoose = require('mongoose')
const URI = process.env.DATABASE_URL

const connectDB = async () => {
    console.log("attempting to connect to the database")
    await mongoose.connect(URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    console.log("database successfully connected")
}

module.exports = connectDB;