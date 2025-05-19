const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const refreshPropertyData = require('./scripts/refreshProperties').refreshPropertyData;

cron.schedule('0 */12 * * *', () => {
  console.log("Running auto-refresh every 12 hours...");
  refreshPropertyData();
});


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
app.use('/', require('./routes/propertyRoutes')); 
const port = 3001;

app.listen(port, () => console.log(`Server is running on port ${port}`));