module.exports.delay = function(timeMillis) {
  return new Promise(resolve => setTimeout(resolve, timeMillis));
}
