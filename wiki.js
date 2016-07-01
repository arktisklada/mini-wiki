var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    app = express();


function fibonacci(n) {
  if (n < 2) {
    return 1;
  } else {
    return fibonacci(n - 2) + fibonacci(n - 1);
  }
}

function requestLogger(request, _, next) {
  console.log('Request: ' + request.method + ' ' + request.url);

  if (request.url.match(/Latest_plane_crash/)) {
    fibonacci(34);
  }

  next();
}

function fetchLastestPlaneCrash() {
  var revision,
      dir = __dirname + '/Latest_plane_crash/',
      files = fs.readdirSync(dir);

  revision = files.sort()[files.length - 1];
  return fs.readFileSync(dir + revision).toString();
}

app.use(requestLogger);

app.get('/', function(_, response) {
  response.setHeader('Cache-Control', 'public, max-age=3600');
  response.send('Hello World!');
});

app.get('/Latest_plane_crash', function(_, response) {
  response.setHeader('Cache-Control', 'public, max-age=30');
  response.send(fetchLastestPlaneCrash());
});

app.put('/Latest_plane_crash', function(request, response) {
  // process incoming edits
});

app.listen(3000, function() {
  console.log('Listening on port 3000...');
});