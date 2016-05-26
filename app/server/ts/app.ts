
import * as express from "express";

var app = express();

app.use('/', express.static(__dirname + '/../../client/'));
app.use('/node_modules/', express.static(__dirname + '/../../../../node_modules/'));

app.get('/api/authenticate', (req, res) => {
	res.send({});
});

app.listen(3000);
