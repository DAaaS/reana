import * as express from "express";
let xmlrpc = require('xmlrpc');

//ignore bad certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = express();

app.use('/', express.static(__dirname + '/../../client/'));
app.use('/node_modules/', express.static(__dirname + '/../../../../node_modules/'));

app.get('/api/authenticate', (req, res) => {
	var username = req.query.username;
	var password = req.query.password;

	var client = xmlrpc.createSecureClient({ host: 'hn1.nubes.rl.ac.uk', port: 443, path: '/RPC2'});

	client.methodCall('one.user.login', [username + ":" + password, username, "", -1], function(error, result) {
		var isSuccess = result[0];

		if(isSuccess){
			res.json({
				token: result[1]
			});
		} else {
			res.status(403).json({
				message: result[1],
				code: result[2],
			});
		}
	});
});

app.listen(3000);