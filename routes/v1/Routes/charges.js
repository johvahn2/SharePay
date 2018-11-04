module.exports = function () {

    const express = require('express');
    const router = express.Router();
    const {orders, costumers, products, charges} = require('../StripeCalls')



    router.post('/', async (req,res) => {
        let {amount, currency, source, shipping, receipt_email, description, customer, capture} = req.body;

        try{

            let order = await charges.create(amount,currency,source, receipt_email, shipping, description, customer, capture);
            
            return res.status(200).json({status:'true', order});

        }catch(err){
            return res.status(500).json({status:'false', mess: err.message});
        }

    });


    // Retrieve an charge.
    router.get('/:id', async (req, res) => {
        try {
        return res.status(200).json({status: 'true', mess: "Got Order", order: await orders.retrieve(req.params.id)});
        } catch (err) {
        return res.sendStatus(404);
        }
    });


    // Pay Capture a Charge.
    router.post('/capture/pay', async (req,res) => {
        let {chargeId, amount} = req.body;

        try{

            let order = await charges.capture(chargeId,amount);
            
            return res.status(200).json({status:'true', order});

        }catch(err){
            return res.status(500).json({status:'false', mess: err.message});
        }

    });

    return router;
}