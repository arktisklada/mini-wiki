var fs = require('fs'),
    path = require('path'),
    promiseRedis = require('promise-redis')();

const redis = promiseRedis.createClient();

const LATEST_PLANE_CRASH_REDIS_KEY = 'Latest_plane_crash';
const LATEST_PLANE_CRASH_DIR = __dirname + '/pages/Latest_plane_crash/';

function getLastestPlaneCrashRevision() {
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
  return getLastestPlaneCrashRevision().then(function(revision) {
    var filename = LATEST_PLANE_CRASH_DIR + revision;
    return fs.readFileSync(filename).toString();
  });
}

function saveLatestPlaneCrash(newRevision, content) {
  var newRevisionFile = LATEST_PLANE_CRASH_DIR + newRevision,
      writeStream = fs.createWriteStream(newRevisionFile);

  writeStream.write(content);
  writeStream.end();

  return redis.set(LATEST_PLANE_CRASH_REDIS_KEY, newRevision);
}

module.exports = {
  fetch: fetchLastestPlaneCrash,
  getLatestRevision: getLastestPlaneCrashRevision,
  write: saveLatestPlaneCrash
};