/**
 * Bootstrap file
 *
 * @author Long Pham
 * @type {*|start}
 */

const express = require ('express');
const accessLogger = require ('morgan');
const bodyParser = require ('body-parser');
const nofavicon = require ('express-no-favicons');
const process = require ('process');
const path = require ('path');
const http = require ('http');
const fs = require ('fs');
const compression = require ('compression');
const helmet = require ("helmet");
const cookieParser = require ('cookie-parser');
const methodOverride = require ('method-override');
const cors = require("cors");

//===== define root path
global.__ROOT = __dirname + '/';

//===== INCLUDING ENVIRONMENT CONFIGURATION
process.env.APPLICATION_ENVIRONMENT = 'local';
global.CONSTANT = require ('./config/constant');
global.APP_SETTINGS = require ('./config/config');

//===== Default Timezone
process.env.TZ = APP_SETTINGS.TIMEZONE;

//===== Enable logger
global.Logger = require ('./app/libraries/Common/Logger/Logger');

//===== all of our routes
const ErrorHandler = require ('./app/middlewares/Error/ErrorHandler');
const NotAcceptableError = require ('./app/libraries/Exception/NotAcceptableError');

//===== ZIPKIN Middleware Declare
const {Tracer} = require ('zipkin');
const zipkinMiddleware = require ('zipkin-instrumentation-express').expressMiddleware;
const CLSContext = require ('zipkin-context-cls');
const ctxImpl = new CLSContext ('zipkin');
const {recorder} = require ('./app/middlewares/Zipkin/Recorder');
const localServiceName = APP_SETTINGS.ZIPKIN.NAME;
global.tracer = new Tracer ({ctxImpl, recorder: recorder (), localServiceName});


//===== CREATE EXPRESS INSTANCE
const app = express ();

//===== RUN ZIPKIN MIDDLEWARE
app.use (zipkinMiddleware ({tracer}));

/**
 * Running API behind LB
 * http://expressjs.com/en/guide/behind-proxies.html
 */
app.enable ('trust proxy');

// set server listening port
let PORT = APP_SETTINGS.PORT;
let HOST = APP_SETTINGS.HOST;
let PROTOCOL = APP_SETTINGS.PROTOCOL;

//===== COMPRESS RESPONSE
app.use (compression ());

// Armoring the API with Helmet
app.use (helmet ());

//===== ENABLE LOG
const rfs = require ('rotating-file-stream');
//const PostgreSQL = require('./libraries/Common/Database/postgres');
let logDirectory = path.join (__dirname, 'logs');
// ensure log directory exists
fs.existsSync (logDirectory) || fs.mkdirSync (logDirectory);
// create a rotating write stream
let accessLogStream = rfs ('access.log', {
  interval: '1d', // rotate daily
  path    : logDirectory
});
// setup the access logger
app.use (accessLogger ('combined', {stream: accessLogStream}));

app.use ((req, res, next) => {
  // Service only accepts the submitted data with the following content-types: application/json and application/x-www-form-urlencoded
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    let contentType = req.get ('content-type');

    if (!contentType || ((contentType.indexOf ('application/json') === -1) && (contentType.indexOf (
        'application/x-www-form-urlencoded') === -1))) {
      next (new NotAcceptableError ('Content-Type is not acceptable', CONSTANT.HTTP_STATUS_NOT_ACCEPTABLE));
    }
  }

  next ();
});

//===== INITIATE PARSER
/**
 * @see https://coderwall.com/p/qrjfcw/capture-raw-post-body-in-express-js
 *
 * @param req
 * @param res
 * @param buf
 * @param encoding
 */
let rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString (encoding || 'utf8');
  }
  else {
    req.rawBody = empty (req.body) ? '' : req.body;
  }

  Logger.debug ("\n\n");
  Logger.debug ('|--------------------o0o--------------------|');
  Logger.debug ('|               Request started!            |');
  Logger.debug ('|--------------------o0o--------------------|');

  Logger.debug ('Api request body:');
  Logger.debug (req.rawBody);
};

// If one of bodyParser middleware apply then next one will not run.
// If request is not a json nor urlencoded then raw parser will process it.
app.use (bodyParser.json ({verify: rawBodySaver}));
app.use (bodyParser.urlencoded ({verify: rawBodySaver, extended: true}));
app.use (bodyParser.raw ({
  verify: rawBodySaver, type: function () {
    return true
  }
}));

app.use (cookieParser ());
app.use (methodOverride ('X-HTTP-Method-Override'));
app.use(cors({origin: APP_SETTINGS.CORS, credentials: true}));

//===== IMPLEMENT MIDDLE-WARES LOGIC HERE
app.use ((req, res, next) => {
  // ALLOW CORS
  // Website you wish to allow to connect
  res.setHeader ('Access-Control-Allow-Origin', PROTOCOL + '://' + HOST + ':' + PORT);

  // Request methods you wish to allow: GET, POST, OPTIONS, PUT, PATCH, DELETE
  res.setHeader ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader ('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader ('Access-Control-Allow-Credentials', false);

  res.setHeader ("Content-Type", APP_SETTINGS.ACCEPT_CONTENT_TYPE);

  res.setHeader ("Accept", APP_SETTINGS.ACCEPT_TYPE.join (', '));

  // set power-by
  res.setHeader ('X-Powered-By', APP_SETTINGS.POWER_BY);

  if (req.method === 'OPTIONS') {
    res.status (CONSTANT.HTTP_STATUS_OK).end ();
  }

  next (); // make sure we go to the next routes and don't stop here
});

// UNSET FAVICON
app.use (nofavicon ());

app.use ((req, res, next) => {
  // Go and validate request's security here (you can implement the following methods: HMAC, RSA, ACCESS TOKEN, STUB)
  next ();
});

//my config to make MVC
const route = require('./app/routes');

//Routes init
route(app);

//======== CONTROLLER ROUTING
//app.use('/v1', require('./routes/example'));

// MUST ADD ERROR HANDLER AT VERY BOTTOM
// catch 404 and forward to error handler
app.use (function (req, res, next) {
  let err = new Error ('Not Found');
  err.status = CONSTANT.HTTP_STATUS_NOT_FOUND;
  next (err);
});

//===== ERROR HANDLER
app.use (ErrorHandler ());

//===== START SERVER
app.listen(APP_SETTINGS.PORT, () => {
  console.log(`Example app listening on port ${APP_SETTINGS.PORT}`);
});

module.exports = app;
