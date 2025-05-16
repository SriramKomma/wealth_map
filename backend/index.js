const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));

//database connection
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('MongoDB connected'))
.catch((err) => console.log("MongoDb not connected",err));


//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))

app.use('/',require('./routes/authRoutes'));
const port = 3001;

app.listen(port, () => console.log(`Server is running on port ${port}`));