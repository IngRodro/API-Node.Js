//Modules
const morgan = require('morgan');
const express = require('express');

const app = express();

//Settings
app.set('appName', 'Sistema Restaurante');
app.set('port', 5000);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use('/user',require('./routes/user'));
app.use('/supplier',require('./routes/supplier'));

app.listen(app.get('port'), ()=>{
    console.log(app.get('appName'));
    console.log(   `Server on port ${app.get('port')}`);
});