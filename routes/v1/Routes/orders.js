module.exports = function () {

    var express = require('express');
    var router = express.Router();

    const {orders, costumers, products, charges} = require('../StripeCalls')



    router.post('/', async (req,res) => {
        let {currency, items, email, shipping, customer} = req.body;

        try{

            let order = await orders.create(currency, items, email, shipping, customer);
            return res.status(200).json({status:'true', order});

        }catch(err){
            return res.status(500).json({status:'false', mess: err.message});
        }

    });

    // Retrieve an order.
    router.get('/:id', async (req, res) => {
        try {
        return res.status(200).json({status: 'true', mess: "Got Order", order: await orders.retrieve(req.params.id)});
        } catch (err) {
        return res.sendStatus(404);
        }
    });

    // Complete payment for an order using a source.
    router.post('/:id/pay', async (req, res) => {
        
        let {source, shipping} = req.body;

        try{

        // Retrieve the order associated to the ID.
        let order = await orders.retrieve(req.params.id);

            // Verify that this order actually needs to be paid.
            if (order.metadata.status === 'pending' || order.metadata.status === 'paid') {
                return res.status(403).json({status:'false', mess:'Order unpayable', order, source});
            }

            // Demo: In test mode, replace the source with a test token so charges can work.
            if (!order.livemode) {
                source.id = 'tok_visa';
            }

            if (source) {
                let charge, status;

                try{

                    charge = await charges.create(order.amount, order.currency, source.id ,order.email, shipping, undefined, undefined, true);

                }catch(err){
                    status = 'failed';
                }

                if (charge && charge.status === 'succeeded') {
                    status = 'paid';
                } else if (charge) {
                    status = charge.status;
                } else {
                    status = 'failed';
                }

                // Update the order with the charge status.
                order = await orders.update(order.id, {metadata: {status}});
                return res.status(200).json({status:'true', mess:'Order Payed', order, source});
            }
        }catch(err){
            return res.status(500).json({mess: err.message});
        }

    });

    return router;

}
