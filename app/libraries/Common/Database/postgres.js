const Connections = require('./connections');
const { Pool } = require('pg');

class PostgreSQL extends Connections {
    // protected pool: Pool;
    constructor() { 
        super('postgres');

        const configDB = global.APP_SETTINGS.POSTGRES_CONNECTION_STRING;
        
        this.pool = new Pool({
            host: configDB.host, // Change this to your PostgreSQL server's address if it's remote
            database: configDB.database,
            user: configDB.user,
            password: configDB.password,
            port: configDB.port, // Default PostgreSQL port is 5432
        });
    }
    
    // Method to connect to the database
    async connect() {
        try {
            await this.pool.connect();
            console.log('Connected to PostgreSQL database');
        } catch (err) {
            console.error('Error connecting to the database', err);
            throw err;
        }
    }

    // Method to disconnect from the database
    async disconnect() {
        try {
            await this.pool.end();
            console.log('Disconnected from PostgreSQL database');
        } catch (err) {
            console.error('Error disconnecting from the database', err);
            throw err;
        }
    }

    async query(text, params) {
        try {
          const result = await this.pool.query(text, params);

          return result;
        } catch (err) {
          console.error('Error executing query', err);
          throw err;
        }
      }
}

// // Test the database connection
// pool.connect((err, client, done) => {
//     if (err) {
//       console.error('Error connecting to the database', err);
//     } else {
//       console.log('Connected to PostgreSQL database');
//       done(); // release the client back to the pool
//     }
// });

// async function connect() {
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/alpha')
//             .then(() => console.log('Connected!'));
//     } catch (error) {
//         console.log('Connected Failed');
//     }
// }
module.exports = PostgreSQL;