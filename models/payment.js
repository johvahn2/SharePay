var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PaymentSchema = new Schema({
    charge_id:{type: String},
    amount:{type: Number},
    livemode:{type: Boolean},
    email:{type: String},
    tag:{type: String},
    project:{type: String},
    createddate :{type: Date, default: Date.now}

  });

  module.exports = mongoose.model('paymentModel', PaymentSchema);