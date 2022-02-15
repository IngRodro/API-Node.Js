const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const connection = require('../connection')

//Ruta Login.
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

//Ruta guardar usuario.
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

//Ruta para actualizar usuario.
router.put('/update/:username_req', (req, res) =>{

    let user = req.body;
    let second_user = req.params;

    //Consulta (1): para actualizar el usuario.
    let sql = `call restaurant.sp_update_users(?,?,?,?,?,?,?,?,?);`;
    let values = [
        user.name,
        user.lastname,
        user.age,
        user.number,
        user.email,
        bcrypt.hashSync(user.password, 12),
        user.rol,
        user.state,
        second_user.username_req,
    ];

    //Bloque que activa la consulta (1)
    connection.query(sql, values, (err) => {
        if (err) {
            throw err;
        }
        res.send({ status: "updated" });
    });
});

//Ruta para actualizar solo el nombre de usuario.
router.put('/update/username/:username_req', (req, res) =>{

    let user = req.body;
    let second_user = req.params;

    let sql = `update users set username=? where username=?;`;
    const value = [user.username, second_user.username_req];

    //Consulta (2): para verificacion de usuario.
    const verificatioQuery = `SELECT * from users where users.username = ?;`;
    const verificationValue = value[0];

    connection.query(verificatioQuery, verificationValue, function(error, results){
        if(results.length === 0){
            connection.query(sql, value, (err)=>{
                if(err){
                    throw err;
                }
                else{
                    res.send({state: 'The username has been updated'});
                }
            });
        }
        else{
            res.send({ status: "this user has already been used" });
        }
    });
});

//Ruta para eliminar usuario.
router.delete('/delete/:username_req', (req, res) =>{

    let username = req.params.username_req;

    //Consulta (1): para eliminar el usuario.
    let sql = `delete from restaurant.users where users.username = ?;`;
    const value = username;

    //Bloque que activa la consulta (1)
    connection.query(sql, value, (error, results)=>{
        if(error){
            throw error;
        }
        else{
            res.send({state: 'deleted'});
        }
    });
});

module.exports = router;