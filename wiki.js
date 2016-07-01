var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    requestLogger = require('./requestLogger'),
    lastestPlaneCrashDir = __dirname + '/Latest_plane_crash/';


function fetchLastestPlaneCrashRevision() {
  var revision,
      files = fs.readdirSync(lastestPlaneCrashDir);

  return revision = files.sort()[files.length - 1];
}

function fetchLastestPlaneCrash() {
  var filename = lastestPlaneCrashDir + fetchLastestPlaneCrashRevision();
  return fs.readFileSync(filename).toString();
}

app.get('/', function(_, response) {
  response.setHeader('Cache-Control', 'public, max-age=3600');
  response.send('Hello World!');
});

app.get('/Latest_plane_crash', function(_, response) {
  response.setHeader('Cache-Control', 'public, max-age=30');
  response.send(fetchLastestPlaneCrash());
});

app.get('/Latest_plane_crash/edit', function(_, response) {
  response.setHeader('Cache-Control', 'nocache');
  response.send('Hello World!');
});

app.put('/Latest_plane_crash', function(request, response) {
  // process incoming edits
  var latestRevision = fetchLastestPlaneCrashRevision(),
      newRevision;

  if (request.body.revision == latestRevision) {
    newRevision = dir + Date.now() + '.html';
    fs.writeFileSync(newRevision, request.body.content);
    res.redirect(request.url);
  } else {
    res.send(JSON.stringify({
      message: 'Please update a more up-to-date version',
      content: fetchLastestPlaneCrash()
    }));
  }
});

app.use(requestLogger);

app.listen(3000, function() {
  console.log('Listening on port 3000...');
});