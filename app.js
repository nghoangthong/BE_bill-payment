/**
 * Bootstrap file
 *
 * @author Long Pham
 * @type {*|start}
 */

const express = require('express');
const accessLogger = require('morgan');
const nofavicon = require('express-no-favicons');
const process = require('process');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const useragent = require('express-useragent');

//===== define root path
global.__ROOT = __dirname + '/';

//===== INCLUDING ENVIRONMENT CONFIGURATION
global.CONSTANT = require('./config/constant');
global.APP_SETTINGS = require('./config/config');

//===== Default Timezone
process.env.TZ = APP_SETTINGS.TIMEZONE;

//===== Enable logger
global.Logger = require('./app/libraries/Common/Logger/Logger');

//===== all of our routes
const {errorHandler} = require('./app/middlewares/Error/ErrorHandler');
const HttpNotAcceptableError = require('./app/libraries/Exception/HttpNotAcceptableError');
const HttpNotFoundError = require('./app/libraries/Exception/HttpNotFoundError');

//===== CREATE EXPRESS INSTANCE
const app = express();

//===== ZIPKIN Middleware Declare
/**
 * => Just ignore on Local only
 * => Uncomment before you commit to develop environment
 *
 const {Tracer} = require ('zipkin');
 const zipkinMiddleware = require ('zipkin-instrumentation-express').expressMiddleware;
 const CLSContext = require ('zipkin-context-cls');
 const ctxImpl = new CLSContext ('zipkin');
 const {recorder} = require ('./app/middlewares/Zipkin/Recorder');
 const localServiceName = APP_SETTINGS.ZIPKIN.NAME;
 global.tracer = new Tracer ({ctxImpl, recorder: recorder (), localServiceName});
 */

//===== RUN ZIPKIN MIDDLEWARE
// app.use (zipkinMiddleware ({tracer}));

/**
 * Running API behind Load Balancer
 * http://expressjs.com/en/guide/behind-proxies.html
 */
app.enable('trust proxy');

// set server listening port
let PORT = APP_SETTINGS.PORT;
let HOST = APP_SETTINGS.HOST;
let PROTOCOL = APP_SETTINGS.PROTOCOL;

//===== ENABLE LOG
const rfs = require('rotating-file-stream');

let logDirectory = path.join(__dirname, 'logs');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a rotating write stream
let accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});
// setup the access logger
app.use(accessLogger('combined', {stream: accessLogStream}));

app.use((req, res, next) => {
    Logger.info(`Bill Payment Service -- X-Request-Id: ${req.headers['x-request-id']}\n`);
    Logger.info(`Bill Payment Service -- X-Tenant-Id: ${req.headers['x-tenant-id']}\n`);

    // Service only accepts the submitted data with the following content-types: application/json and application/x-www-form-urlencoded
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        let contentType = req.get('content-type');

        if (!contentType || ((contentType.indexOf('application/json') === -1) && (contentType.indexOf(
            'application/x-www-form-urlencoded') === -1))) {
            next(new HttpNotAcceptableError('Content-Type is not acceptable.', CONSTANT.HTTP_STATUS_NOT_ACCEPTABLE));
        }
    }

    next();
});

//===== INITIATE PARSER
// If one of bodyParser middleware apply then next one will not run.
// If request is not a json nor urlencoded then raw parser will process it.
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(methodOverride('X-HTTP-Method-Override'));

app.use(useragent.express());

// UNSET FAVICON
app.use(nofavicon());
//===== COMPRESS RESPONSE
app.use(compression());

// Armoring the API with Helmet
app.use(helmet());

app.use(cookieParser());
app.use(cors({origin: APP_SETTINGS.CORS, credentials: true}));

//===== IMPLEMENT MIDDLE-WARES LOGIC HERE
app.use((req, res, next) => {
    // ALLOW CORS
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', PROTOCOL + '://' + HOST + ':' + PORT);

    // Request methods you wish to allow: GET, POST, OPTIONS, PUT, PATCH, DELETE
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    res.setHeader('Content-Type', APP_SETTINGS.ACCEPT_CONTENT_TYPE);

    res.setHeader('Accept', APP_SETTINGS.ACCEPT_TYPE.join(', '));

    // set Request Id from Gateway
    if (req.headers['x-service-id']) {
        res.setHeader('X-Request-Id', req.headers['x-service-id']);
    }

    // set Tenant Id from Gateway
    if (req.headers['x-tenant-id']) {
        res.setHeader('X-Tenant-Id', req.headers['x-tenant-id']);
    }

    // set power-by
    res.setHeader('X-Powered-By', APP_SETTINGS.POWER_BY);

    if (req.method === 'OPTIONS') {
        res.status(CONSTANT.HTTP_STATUS_OK).end();
    }

    next(); // make sure we go to the next routes and don't stop here
});

//======== ALL REQUESTS MUST BE AUTHORIZED
const RSAAuthMiddleware = require('./app/middlewares/Auth/RSAAuth');
// app.use(RSAAuthMiddleware);

//======== CONTROLLER ROUTING
const route = require('./app/routes');

//Routes init
route(app);

//===== ERROR HANDLER
app.use(errorHandler);

// MUST ADD ERROR HANDLER AT VERY BOTTOM
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(new HttpNotFoundError());
});

//===== START SERVER
app.listen(PORT, () => {
    Logger.info(`Bill Payment Service is listening on port ${PORT}`);
    console.log(`Bill Payment Service is listening on port ${PORT}`);
});

module.exports = app;
