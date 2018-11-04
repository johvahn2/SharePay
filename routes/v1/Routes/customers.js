module.exports = function () {
    const express = require('express');
    const router = express.Router();
    const {orders, costumers, products, charges} = require('../StripeCalls');


    router.post('/', async (req,res) => {
        let {email, source, shipping, description} = req.body;

        try{

            let customer = await costumers.create(email,source,shipping,description);
            
            return res.status(200).json({status:'true', customer});

        }catch(err){
            return res.status(500).json({status:'false', mess: err.message});
        }

    });

    router.post('/update', async (req,res) => {
        let {email, source, shipping, description} = req.body;

        try{

            let customer = await costumers.update(email,source,shipping,description);
            
            return res.status(200).json({status:'true', customer});

        }catch(err){
            return res.status(500).json({status:'false', mess: err.message});
        }

    });

    // Retrieve an Customer.
    router.get('/:id', async (req, res) => {
        try {
        return res.status(200).json({status: 'true', mess: "Got Customer", customer: await costumers.retrieve(req.params.id)});
        } catch (err) {
        return res.sendStatus(404);
        }
    });

    // Delete an Customer.
    router.delete('/delete/:id', async (req, res) => {
        try {
        return res.status(200).json({status: 'true', mess: "Deleted Customer", customer: await costumers.delete(req.params.id)});
        } catch (err) {
        return res.sendStatus(404);
        }
    });

    return router;

}


