const express = require('express');
const router = express.Router();
const connection = require('../connection')

router.post('/save',(req, res)=>{
    let supplier = req.body;
    const query = `SELECT * from suppliers where suppliers.name = ?;`;
    const values = [supplier.name];
    connection.query(query, values, function (error, results) {
        if (error) {
        throw error;
        }
        if (results.length === 0) {
        let supplier = req.body;
        let sql = `INSERT INTO suppliers(name, location, number, email, state) VALUES(?,?,?,?,?);`;
        let values = [
            supplier.name,
            supplier.location,
            supplier.number,
            supplier.email,
            supplier.state,
        ];
        connection.query(sql, values, (err) => {
            if (err) {
            throw err;
            }
            res.send({ status: "Supplier save" });
        });
        } else {
        res.send({ status: "The Supplier is registered" });
        }
    });
});

module.exports = router;