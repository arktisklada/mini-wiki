function requestLogger(request, _, next) {
  console.log('Request: ' + request.method + ' ' + request.url);

  next();
}

module.exports = requestLogger;