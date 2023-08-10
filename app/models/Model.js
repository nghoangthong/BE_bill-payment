const PostgresDB = require('../libraries/Common/Database/postgres');

class Model {
    constructor(dbName) { 
        const dbType = global.CONSTANT.POSTGRES_DB;
        switch (dbName) {
            case dbType:
                this.model = new PostgresDB();
                break;
            default:
                this.model = new PostgresDB();
        }
    }
}

module.exports = Model;