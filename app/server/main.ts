
import * as express from "express";

var app = express();

app.get('/', (req, res) => res.send('Coming soon!'));

app.get('/api/authenticate', (req, res) => {
	res.send({});
});

app.listen(3000);
