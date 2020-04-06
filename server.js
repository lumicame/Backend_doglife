const express  = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

const app=express();
var port = process.env.PORT || 3000;


app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use('/api/',require('./routes/users'));
app.use('/api/',require('./routes/publications'));
app.use('/api/',require('./routes/news'));

app.listen(port);
console.log('The magic happens on port ' + port);