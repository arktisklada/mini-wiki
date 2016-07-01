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

module.exports = requestLogger;