var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    promiseRedis = require('promise-redis')(),
    requestLogger = require('./requestLogger');

const redis = promiseRedis.createClient();
const LATEST_PLANE_CRASH_DIR = __dirname + '/Latest_plane_crash/';
const LATEST_PLANE_CRASH_REDIS_KEY = 'Latest_plane_crash';


function fetchLastestPlaneCrashRevision() {
  return redis.get('Latest_plane_crash').then(function(revision) {
    var files;

    if (revision === null) {
      files = fs.readdirSync(LATEST_PLANE_CRASH_DIR);
      revision = files.sort()[files.length - 1];
      redis.set(LATEST_PLANE_CRASH_REDIS_KEY, revision);
    }

    return revision;
  });
}

function fetchLastestPlaneCrash() {
  return fetchLastestPlaneCrashRevision().then(function(revision) {
    var filename = LATEST_PLANE_CRASH_DIR + revision;
    return fs.readFileSync(filename).toString();
  });
}


app.get('/', function(_, response) {
  response.setHeader('Cache-Control', 'public, max-age=3600');
  response.send('Hello World!');
});

app.get('/Latest_plane_crash', function(_, response) {
  response.setHeader('Cache-Control', 'public, max-age=30');
  fetchLastestPlaneCrash().then(function(fileData) {
    response.send(fileData);
  });
});

app.get('/Latest_plane_crash/edit', function(_, response) {
  response.setHeader('Cache-Control', 'nocache');
  response.send('Hello World!');
});

app.put('/Latest_plane_crash', function(request, response) {
  fetchLastestPlaneCrashRevision().then(function(latestRevision) {
    var newRevision, newRevisionFile;

    if (request.body.revision == latestRevision) {
      newRevision = Date.now();
      newRevisionFile = LATEST_PLANE_CRASH_DIR + newRevision + '.html';

      fs.writeFileSync(newRevision, request.body.content);

      redis.set(LATEST_PLANE_CRASH_REDIS_KEY, newRevision).then(function() {
        res.redirect(request.url);
      })
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