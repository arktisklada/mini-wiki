var express = require('express'),
    app = express(),
    requestLogger = require('./requestLogger'),
    latestPlaneCrash = require('./latestPlaneCrash');


app.get('/', function(_, response) {
  response.setHeader('Cache-Control', 'public, max-age=3600');
  response.send('Hello World!');
});

app.get('/Latest_plane_crash', function(_, response) {
  response.setHeader('Cache-Control', 'public, max-age=30');
  latestPlaneCrash.fetch().then(function(fileData) {
    response.send(fileData);
  });
});

app.get('/Latest_plane_crash/edit', function(_, response) {
  response.setHeader('Cache-Control', 'nocache');
  response.send('Hello World!');
});

app.put('/Latest_plane_crash', function(request, response) {
  latestPlaneCrash.latestRevision().then(function(latestRevision) {
    if (request.body.revision == latestRevision) {
      latestPlaneCrash.write(Date.now(), request.body.content)
        .then(function() {
          res.redirect(request.url);
        });
    } else {
      res.send(JSON.stringify({
        message: 'Please update a more up-to-date version',
        content: fetchLastestPlaneCrash()
      }));
    }
  });
});

app.use(requestLogger);

app.listen(3000, function() {
  console.log('Listening on port 3000...');
});