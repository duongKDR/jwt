const express = require('express');
const app = express();
var path = require("path");
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config()
const cookie = require('cookie');
const userRouter = require("./routers/userRouter")
// const PostRouter = require("./routes/postRouter")


// Mongo DB Connections
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(response=>{
    console.log('MongoDB Connection Succeeded.')
}).catch(error=>{
    console.log('Error in DB connection: ' + error)
});

app.use(cors())
app.use(express.json())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use(userRouter)
// app.use(PostRouter)

// Connection
const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log('App running in port: '+PORT)
})