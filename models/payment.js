var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PaymentSchema = new Schema({
    charge_id:{type: String},
    currency:{type: String},
    amount:{type: Number},
    capture:{type: String},
    livemode:{type: String},
    email:{type: String},
    description:{type: String},
    project:{type: String},
    createddate :{type: Date, default: Date.now}

  });

  module.exports = mongoose.model('paymentModel', PaymentSchema);