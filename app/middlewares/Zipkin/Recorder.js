const {BatchRecorder, jsonEncoder: {JSON_V2}} = require ('zipkin');
const {HttpLogger} = require ('zipkin-transport-http');

const httpLogger = new HttpLogger ({
  endpoint   : APP_SETTINGS.ZIPKIN.ENDPOINT,
  jsonEncoder: JSON_V2
});

function recorder () {
  return new BatchRecorder ({logger: httpLogger});
}

module.exports.recorder = recorder;