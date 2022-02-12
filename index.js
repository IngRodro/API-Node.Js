const morgan = require('morgan');
const express = require('express');
var mysql = require('mysql');

const app = express();

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'restaurantebd'
  });


  connection.connect(err =>{
      if(err){throw err};
          console.log('Conexion a BD exitosa')
      
  });
//Settings
app.set('appName', 'Sistema Restaurante');
app.set('port', 5000);

//Middlewares
app.use(morgan('dev'));

app.get('/', (req, res)=>{
    let query = 'SELECT * from usuarios'
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('appName'));
    console.log(   `Server on port ${app.get('port')}`);
});