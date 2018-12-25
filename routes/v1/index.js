var express = require('express');
var app = module.exports = express();
const orders = require('./Routes/orders');
const charges = require('./Routes/charges');
const customers = require('./Routes/customers');
var mongoose = require('mongoose');
var db_config = require('../../config/db');


mongoose.connect(db_config,{ useNewUrlParser: true }, function (err,db) {
    if (err) {
        console.log(err);
    } else {
        if(process.env.NODE_ENV === 'prod')
            console.log('Connected to mongodb!(prod)');
        else
            console.log('Connected to mongodb!(local)');

        app.get('/', function (req, res) {
            res.send("API version 1 UP");
        });

        app.use('/orders', orders());
        app.use('/charges', charges());
        app.use('/customers', customers());

    }

});


        
        