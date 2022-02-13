const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require("bcryptjs");

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'restaurant'
});

connection.connect(err =>{
    if(err){throw err};
        console.log('Conexion a BD exitosa')
    
});

//Ruta Login
router.get('/login',(req, res)=>{
    let user = req.body;
    const query = `SELECT * from users where users.username = ?;`;
    const values = [user.username];
    connection.query(query, values ,function (error, results) {
        if (error) throw error;
        if(results.length === 1){
            bcrypt.compare(user.password, results[0].password, (err, match) => {
                if (err) {
                    console.log("Error comprobando:", err);
                } else {
                if(match){
                        const resJson = {
                            user: results[0].username,
                            rol : results[0].rol
                        }
                        res.send(resJson);
                }else{
                    res.send('Error de sesion')
                }
                }
            });
        }else{
            res.send('Error de sesion')
        }
    });
});

//Ruta guardar usuario
router.post('/save',(req, res)=>{
    let user = req.body;
    const query = `SELECT * from users where users.username = ?;`;
    const values = [user.username];
    connection.query(query, values, function (error, results) {
        if (error) {
        throw error;
        }
        if (results.length === 0) {
        let user = req.body;
        let sql = `INSERT INTO users(username, name, lastname, age, number, email, password, rol, state) VALUES(?,?,?,?,?,?,?,?,?);`;
        let values = [
            user.username,
            user.name,
            user.lastname,
            user.age,
            user.number,
            user.email,
            bcrypt.hashSync(user.password, 12),
            user.rol,
            user.state,
        ];
        connection.query(sql, values, (err) => {
            if (err) {
            throw err;
            }
            res.send({ status: "save" });
        });
        } else {
        res.send({ status: "User not available" });
        }
    });
});

module.exports = router;