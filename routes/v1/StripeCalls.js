const keys = require('../../config/keys/keys');
const stripe = require("stripe")(keys.stripeSecretKey);

//------------------------Orders----------------------------------------//

// Create an order.
const createOrder = async (currency, items, email, shipping, customer) => {
        return await stripe.orders.create({
          currency,
          items,
          customer,
          email,
          shipping,
          metadata: {
            status: 'created',
          },
        });


};

// Retrieve an order by ID.
const retrieveOrder = async orderId => {
    return await stripe.orders.retrieve(orderId);
};

// Update an order.
const updateOrder = async (orderId, properties) => {
    return await stripe.orders.update(orderId, properties);
};

exports.orders = {
    create: createOrder,
    retrieve: retrieveOrder,
    update: updateOrder,
};


//------------------------Products----------------------------------------//


// List all products.
const listProducts = async () => {
    return await stripe.products.list({limit: 3, type: 'good'});
};

// Retrieve a product by ID.
const retrieveProduct = async productId => {
    return await stripe.products.retrieve(productId);
};

// Validate that products exist.
const productsExist = productList => {
    const validProducts = ['N/A', 'N/A', 'N/A'];
    return productList.data.reduce((accumulator, currentValue) => {
        return (
        accumulator &&
        productList.data.length === 3 &&
        validProducts.includes(currentValue.id)
        );
    }, !!productList.data.length);
};


exports.products = {
    list: listProducts,
    retrieve: retrieveProduct,
    exist: productsExist,
};

//------------------------Charges----------------------------------------//

// Create an Charge.
const createCharge = async (amount, currency, source, receipt_email, shipping, description, customer, capture = true) => {
    return await stripe.charges.create({
        amount,
        currency,
        source,
        receipt_email,
        shipping,
        customer,
        description,
        capture
    });
};

// Retrieve an charge by ID.
const retrieveCharge = async chargeId => {
    return await stripe.charges.retrieve(chargeId);
};

// Update an Charge.
const updateCharge = async (chargeId, properties) => {
    return await stripe.charges.update(chargeId, properties);
};

// Capture a Charge.
const CaptureCharge = async (chargeId,amount) => {

    return await stripe.charges.capture(chargeId,amount);
};

exports.charges = {
    create: createCharge,
    retrieve: retrieveCharge,
    update: updateCharge,
    capture: CaptureCharge
};

//------------------------Costumers----------------------------------------//
// Create an costumer.
const createCustomer = async (email, source, shipping, description) => {
    return await stripe.customers.create({
      email,
      source,
      shipping,
      description
    });
};

// Retrieve an customer by ID.
const retrieveCustomer = async customerId => {
    return await stripe.customers.retrieve(customerId);
};

// Update an Customer.
const updateCustomer = async (customerId, properties) => {
    return await stripe.customers.update(customerId, properties);
};

// Delete an customer by ID.
const deleteCustomer = async customerId => {
    return await stripe.customers.del(customerId);
};


exports.costumers = {
    create: createCustomer,
    retrieve: retrieveCustomer,
    update: updateCustomer,
    delete: deleteCustomer
};
