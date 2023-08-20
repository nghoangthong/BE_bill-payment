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

        this.pool.query('SET TIME ZONE \'Asia/Ho_Chi_Minh\'');
        Logger.info('Postgres::constructor -- Executed query to set timezone=\'Asia/Ho_Chi_Minh\'.');
    }

    /**
     * Method to connect to the database
     * @returns {Promise<void>}
     */
    async connect() {
        try {
            await this.pool.connect();
            Logger.info('Postgres::connect -- Connected to PostgreSQL database.');
        } catch (err) {
            Logger.error('Postgres::connect -- Error connecting to the database.');
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
            Logger.info('Postgres::disconnect -- Disconnected from PostgreSQL database.');
        } catch (err) {
            Logger.error('Postgres::disconnect -- Error disconnecting from the database.');
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
            Logger.debug('Postgres::query -- Executing query...');
            Logger.debug(text);
            Logger.debug(params);

            let result = await this.pool.query(text, params);
            let durationTime = Date.now() - startTime;

            Logger.debug('Executed query ', text, ` - duration: ${durationTime} - parameters:`, params);

            return result;
        } catch (err) {
            Logger.error('Postgres::query -- Error executing query.');
            Logger.error(err);
            throw err;
        }
    }
}

module.exports = Postgres;