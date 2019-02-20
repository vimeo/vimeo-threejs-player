const Vimeo = require('vimeo').Vimeo;
const express = require('express');
const hostValidation = require('host-validation')
const ejs = require('ejs');

const app = express();

// Render engine for the express server
app.use(express.static('assets'));
app.use(express.static('dist'));
app.engine('.html', ejs.__express);
app.set('view-engine', 'html');
app.set('views', __dirname + '/examples');

// CORS headers
app.use(function(req, res, next) {
  console.log(`[Server] A ${req.method} request was made to ${req.url}`);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/*
* Vimeo token for local development is saved in a .env file
* For deployment make sure to store it in an enviorment
* variable called VIMEO_TOKEN=4trwegfudsbg4783724343
*/
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();

  if (process.env.VIMEO_TOKEN) {
    console.log('[Server] Enviorment variables loaded from .env 💪🏻');
  } else {
    console.log('[Server] Could not find a VIMEO_TOKEN. Make sure you have a .env file or enviorment variable with the token');
  }
}

app.use(hostValidation({ hosts: [`127.0.0.1:${process.env.PORT}`,
                                 `192.168.1.99:${process.env.PORT}`,
                                 `localhost:${process.env.PORT}`,
                                 /.*\.glitch\.com$/,
                                 /.*\.glitch\.me$/,
                                 process.env.DOMAIN] }))


app.get('/', (request, response) => {
  response.render('basic.html');
});

app.get('/basic', (request, response) => {
  response.render('basic.html');
});

app.get('/webvr-video', (request, response) => {
  response.render('webvr-video.html');
});

app.get('/shapes', (request, response) => {
  response.render('shapes.html');
});

app.get('/album', (request, response) => {
  response.render('album.html');
});

app.get('/two-and-a-half-d', (request, response) => {
  response.render('two-and-a-half-d.html');
});

app.get('/depthkit', (request, response) => {
  response.render('depthkit.html');
});

// The route for getting videos from the vimeo API
app.get('/vimeo/api', (request, response) => {
  let api = new Vimeo(null, null, process.env.VIMEO_TOKEN);

  api.request({
      method: 'GET',
      path: request.query.path,
      headers: { Accept: 'application/vnd.vimeo.*+json;version=3.4' },
    },
    function(error, body, status_code, headers) {
      if (error) {
        response.status(500).send(error);
        console.log('[Server] ' + error);
      } else {
        // Pass through the whole JSON response
        response.status(200).send(body);
      }
    }
  );
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`[Server] Running on port: ${listener.address().port} 🚢`);
});
