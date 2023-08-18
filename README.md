# Prerequisites
### PostgreSQL
- Install latest PostgreSQL
### NodeJS
- Install nodejs version 18.x LTS
### Node Package Manager
- Install NPM

# How to run App
### Set environment variables
    + Environment
       + Name
            APPLICATION_ENVIRONMENT
       + Value: either one of those
            "local" - For LOCAL environment
            "develop" - For DEVELOP environment
            "staging" - For STAGING environment
            "production" - For PRODUCTION environment

### Environment configurations
    Local
        Domain: bill-payment.alphacore.local
        Variables: ./config/vars/local/app
    Development
        Domain: bill-payment02.alphacore.tech
        Variables: ./config/vars/develop/app
    Staging
        Domain: bill-payment01.alphacore.tech
        Variables: ./config/vars/staging/app
    Production
        Domain: bill-payment.alphacore.tech
        Variables: ./config/vars/production/app

### Update hosts file (following the environment that you specify the correct domain)
 
    # BEGIN EXAMPLE EXPRESSJS PROJECT
    127.0.0.1       bill-payment.alphacore.tech
    # END
    
### Run project

    $ cd bill-payment
    $ npm install
    $ npm start

### Browse site at

    https://bill-payment.alphacore.tech:3001/v1/[resource]/[sub-resource]

# API Testing Tool
- Postman Tool: https://www.getpostman.com

# References
- Build restful api using node and express
    + https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
- Keeping API Routing Clean
    + https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
- CORS
    + http://restlet.com/company/blog/2015/12/15/understanding-and-using-cors/
    + http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html
- Security
    + http://expressjs.com/en/advanced/best-practice-security.html
    + http://billpatrianakos.me/blog/2016/02/15/securing-api-keys-in-a-javascript-single-page-app/
    + https://crosp.net/blog/web/nodejs/creating-secure-api-using-nodejs-resful-authentication/
    + http://thejackalofjavascript.com/architecting-a-restful-node-js-app/
    + http://www.hacksparrow.com/express-js-https.html
- Improving the security and performance
    + https://blog.jscrambler.com/setting-up-5-useful-middlewares-for-an-express-api/
    + https://nodejs.org/api/cluster.html#cluster_cluster
- Database
    + https://www.postgresql.org
- Better JS with ES6
    + https://scotch.io/tutorials/better-node-with-es6-pt-i
    + https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes
    + https://scotch.io/tutorials/better-javascript-with-es6-pt-iii-cool-collections-slicker-strings
- Payload Parser
    + https://github.com/expressjs/body-parser#bodyparserrawoptions
    + https://coderwall.com/p/qrjfcw/capture-raw-post-body-in-express-js
