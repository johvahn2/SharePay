module.exports = function () {

    const express = require('express');
    const router = express.Router();
    const {orders, costumers, products, charges} = require('../StripeCalls')
    var paymentModel = require('../../../models/payment');

    //  Create a Charge.
    router.post('/', async (req,res) => {
        let {amount, currency, source, shipping, receipt_email, description,project, tag, type, customer, capture} = req.body;
        tag= description;
        if(!amount || !source || !currency || !receipt_email || !capture){
            return json({status:'false', mess: "Feilds Missing"});
        }
        try{

            let charge = await charges.create(amount,currency,source.id, receipt_email, shipping, description, customer, capture);

            var payment = new paymentModel({
                charge_id:charge.id,
                amount:charge.amount,
                livemode: charge.livemode,
                email:receipt_email,
                tag: tag,
                project: project
            });

            payment.save(function(err,pay) {
                if(err) return json({status:'false', mess: "Failed to Save"});
                
                return res.status(200).json({status:'true', mess: "Payment successful!", charge});

            });
        
        

        }catch(err){
            console.log(err);
            return res.status(304).json({status:'false', mess: err.message});
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


    router.get('/retrieve', function (req, res) {

        var retrieve_all = req.query.all || 'false';
    
        if (retrieve_all === 'false') {
            res.json({ status: "false", mess: "TODO" });
        } else {              
            paymentModel.find( function (err, payments) {
                if (err || !payments) return res.json({ status: "false", mess: "Could Not Find Any Payments" });
    
                res.json({ status: "true", mess: "Found Payments", data: payments });
            });
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

    return router;
}