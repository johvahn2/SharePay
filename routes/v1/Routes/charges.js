module.exports = function () {

    const express = require('express');
    const router = express.Router();
    const {orders, costumers, products, charges} = require('../StripeCalls')
    var paymentModel = require('../../../models/payment');

    //  Create a Charge.
    router.post('/', async (req,res) => {
        let {amount, currency, source, shipping, receipt_email, description,project, type, customer, capture} = req.body;

        if(!amount || !source || !currency || !receipt_email || !capture){
            return json({status:'false', mess: "Feilds Missing"});
        }
        try{

            let charge = await charges.create(amount,currency,source.id, receipt_email, shipping, description, customer, capture);

            var payment = new paymentModel({
                charge_id:charge.id,
                capture: capture,
                currency:currency,
                amount:charge.amount,
                livemode: charge.livemode,
                email:receipt_email,
                description: description,
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

            paymentModel.updateOne({charge_id:chargeId},{ $set: {capture: "true", amount: amount}},function(err,payment){
                if(err){return res.json({status:'false', mess: err});}

                return res.status(200).json({status:'true', order});
            });
            

        }catch(err){
            return res.status(500).json({status:'false', mess: err.message});
        }

    });


    router.get('/retrieve', function (req, res) { //TODO

        let all = req.query.all || 'true';
        let charge_id = req.query.charge_id || null;
        let id = req.query.id || null;
        let project = req.query.project || null;
        let email = req.query.email || null;
        let live = req.query.live || true;
        let capture = req.query.capture || true;

    
        if (all === 'false') {
            if(id !== null) {
                paymentModel.findOne({_id: id}, function (err, payment) {//Search ID
                    if (err || !payment) return res.json({ status: "false", mess: "Could Not Find Any Payment" });
        
                    res.json({ status: "true", mess: "Found Payment", data: payment});
                });            
            } else if(charge_id !== null) {//Search Charge_id
                paymentModel.findOne({charge_id: charge_id}, function (err, payment) {
                    if (err || !payment) return res.json({ status: "false", mess: "Could Not Find Any Payment" });
        
                    res.json({ status: "true", mess: "Found Payment", data: payment});
                });  
            } else if(project !== null) { //Search Project
                if(email !== null) {
                    paymentModel.findOne({project: project, email: email, livemode:live, capture:capture}, function (err, payment) {
                        if (err || !payment) return res.json({ status: "false", mess: "Could Not Find Any Payment" });
            
                        res.json({ status: "true", mess: "Found Payment", data: payment});
                    });                 
                } else {
                    paymentModel.find({project: project, livemode:live, capture:capture}, function (err, payments) {
                        if (err || !payments) return res.json({ status: "false", mess: "Could Not Find Any Payments" });
            
                        res.json({ status: "true", mess: "Found Payments", data: payments});
                    }); 
                }
            } else {
                paymentModel.find({livemode:live, capture:capture}, function (err, payments) {
                    if (err || !payments) return res.json({ status: "false", mess: "Could Not Find Any Payments" });
        
                    res.json({ status: "true", mess: "Found Payments", data: payments});
                });    
            }
            
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