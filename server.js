
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/db');


let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 5000;
}

// Connect database
connectDB();


// Middleware
app.use(express.json());


app.get('/', (req, res)=>{
    res.send('API running');
});

// Define routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));


// Listen to PORT

app.listen(PORT, ()=>{
    console.log('Server started on port ' + PORT);
});

