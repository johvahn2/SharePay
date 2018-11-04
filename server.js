var express = require('express'),
	app = express(),
    cors = require('cors'),
	server = require('http').createServer(app),
	morgan      = require('morgan'),
    bodyParser  = require('body-parser');


const orders = require('./routes/v1/Routes/orders');


// define the versions
const VERSIONS = { 'Version 1': '/v1' };




app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET, POST,DELETE, PUT');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});


var port = process.env.PORT || 5500;
app.use(bodyParser.json({limit:'25mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

app.get('/', function (req, res) {
    res.json(VERSIONS);
});



for (var k in VERSIONS) {
    app.use(VERSIONS[k], require('./routes'+ VERSIONS[k] + '/index'));
}




server.listen(port, function () {
    console.log('Updated : Server listening at port %d', port);
}); 