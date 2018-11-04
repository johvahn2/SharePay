var express = require('express');
var app = module.exports = express();
const orders = require('./Routes/orders');
const charges = require('./Routes/charges');
const customers = require('./Routes/customers');

app.get('/', function (req, res) {
    res.send("API version 1 UP");
});

app.use('/orders', orders());
 app.use('/charges', charges());
 app.use('/customers', customers());

        
        