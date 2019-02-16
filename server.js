
const API_KEY = require('./.env');
const fetch = require('node-fetch');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const dir = path.join(__dirname, 'public');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(dir));

// app.get('/', (req, res) => {
//   // res.sendFile(path.resolve(dir, "index.html"));
//   console.log(dir + '/index.html')
//   res.render(dir + '/index.html');
// });


let url, longitude, latitude;

app.post('/', (req, res) => {	
	console.log(req.body)
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







