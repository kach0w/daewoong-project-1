const bodyParser = require('body-parser')
const express = require('express')
// require('./routes/api/redis/redisClient');  // Ensures Redis client starts
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db')
const grading = require("./routes/api/grading")

const PORT = process.env.PORT || 4002;
const app = express();

// https://teach.ai.com
// https://teach-ai-backend.com
// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',  // replace with your application's URL
  credentials: true,  // IMPORTANT: enable credentials. This is needed for cookies to work
}));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("dev"))
app.use(helmet())
connectDB();

app.use("/v1/grading", grading);
const server = app.listen(PORT, console.log(`API is listening on port ${PORT}`));
server.timeout = 900000; // 15 minute time out max