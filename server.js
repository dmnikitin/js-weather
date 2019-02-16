
const API_KEY = process.env['var API_KEY'];
const fetch = require('node-fetch');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const dir = path.join(__dirname, 'public');
const app = express();
let url, longitude, latitude;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(dir));

app.post('/', (req, res) => {	
	latitude = req.body.latitude;
    longitude = req.body.longitude;
   	url = `https://api.darksky.net/forecast/${API_KEY}/${latitude},${longitude}`;
	if(!latitude || !longitude) {
		res.redirect('/error');
	} 

	fetch(url).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('failed')
    }, networkError => console.log(networkError.message))
    .then(jsonResponse => res.json(jsonResponse))
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));







