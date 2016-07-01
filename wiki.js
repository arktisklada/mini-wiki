var express = require('express'),
    app = express(),
    requestLogger = require('./modules/requestLogger'),
    delayedRequestSimulator = require('./modules/delayedRequestSimulator'),
    latestPlaneCrash = require('./articles/latestPlaneCrash');


app.get('/', function(_, response) {
  response.setHeader('Cache-Control', 'public, max-age=3600');
  response.render('index');
});

app.get('/Latest_plane_crash', function(_, response) {
  response.setHeader('Cache-Control', 'public, max-age=30');
  latestPlaneCrash.fetch().then(function(fileData) {
    response.render('show', { title: 'Latest Plane Crash', content: fileData });
  });
});

app.get('/Latest_plane_crash/edit', function(_, response) {
  response.setHeader('Cache-Control', 'nocache');
  latestPlaneCrash.fetch().then(function(fileData) {
    response.render('edit', { title: 'Latest Plane Crash', content: fileData });
  });
});

app.post('/Latest_plane_crash', function(request, response) {
  latestPlaneCrash.getLatestRevision().then(function(latestRevision) {
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

// Log requests to the console
app.use(requestLogger);
// Fibonacci delay for GET requests
app.use(delayedRequestSimulator);
// Serve static assets
app.use(express.static('public'));

// View templating
app.set('view engine', 'pug');

app.listen(3000, function() {
  console.log('Listening on port 3000...');
});