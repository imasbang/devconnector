
const express = require('express');
const app = express();
const mongoose = require('mongoose');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, ()=>{
    console.log('Server started on port ' + port);
});

app.get('/', (req, res)=>{
    res.send('API running');

});