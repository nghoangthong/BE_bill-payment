const Connection = require('./Connection');
const {Pool} = require('pg');

/**
 * Provide its all interfaces to interact with CRUD
 */
class Postgres extends Connection {
    /**
     * Initiate Postgres instance
     */
    constructor() {
        super('postgres');
        const connectionStr = global.APP_SETTINGS.POSTGRES_CONNECTION_STRING;

        this.pool = new Pool({
            host: connectionStr.host, // Change this to your PostgreSQL server's address if it's remote
            port: connectionStr.port, // Default PostgreSQL port is 5432
            database: connectionStr.database,
            user: connectionStr.user,
            password: connectionStr.password
        });

        this.pool.query("SET TIME ZONE 'Asia/Ho_Chi_Minh'");
        Logger.info(`\n\nPostgres::constructor -- Executed query to set timezone='Asia/Ho_Chi_Minh'.\n`);
    }

    /**
     * Method to connect to the database
     * @returns {Promise<void>}
     */
    async connect() {
        try {
            await this.pool.connect();
            Logger.info(`\n\nPostgres::connect -- Connected to PostgreSQL database.\n`);
        } catch (err) {
            Logger.error(`\n\nPostgres::connect -- Error connecting to the database.\n`);
            Logger.error(err);
            throw err;
        }
    }

    /**
     * Method to disconnect from the database
     * @returns {Promise<void>}
     */
    async disconnect() {
        try {
            await this.pool.end();
            Logger.info(`\n\nPostgres::disconnect -- Disconnected from PostgreSQL database.\n`);
        } catch (err) {
            Logger.error(`\n\nPostgres::disconnect -- Error disconnecting from the database.\n`);
            Logger.error(err);
            throw err;
        }
    }

    /**
     * Method to execute query
     *
     * @param text
     * @param params
     * @returns {Promise<*>}
     */
    async query(text, params) {
        const startTime = Date.now();
        try {
            Logger.debug(`\n\nPostgres::query -- Executing query...\n`);
            Logger.debug(text);
            Logger.debug(params);

            let result = await this.pool.query(text, params);
            let durationTime = Date.now() - startTime;

            Logger.debug(`\nExecuted query `, text, ` - duration: ${durationTime} - parameters:`, params, "\n");

            return result;
        } catch (err) {
            Logger.error(`\n\nPostgres::query -- Error executing query.\n`);
            Logger.error(err);
            throw err;
        }
    }
}

module.exports = Postgres;