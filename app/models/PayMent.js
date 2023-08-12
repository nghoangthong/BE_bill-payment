const Models = require("./Model");

class PayMent extends Models {
    // protected pool: Pool;
    constructor(dbType) {
        super(dbType);
    }

    // create table biilcheck
    createBillCheck = async () => {
        try {
            this.model.connect();
            await this.model.query(`
          CREATE TABLE IF NOT EXISTS billcheck (
            id SERIAL PRIMARY KEY,
            jsonData JSONB NOT NULL
          );
          `);

            console.log('Table "bill_check" created successfully');
        } catch (error) {
            console.log('Error creating "bill_check" table:', error);
        }
    };

    // insert Data Into BillCheck
    async insertDataIntoBillCheck(data) {
        try {
            this.model.connect();
            await this.model.query(
                `
      INSERT INTO billcheck (jsonData) VALUES ($1)
    `,
                [data]
            );
            Logger.info("success");
        } catch (error) {
            Logger.error("error", error);
        }
    }

    // create table billpay
    createBillPay = async () => {
        try {
            this.model.connect();
            await this.model.query(`
          CREATE TABLE IF NOT EXISTS billpay (
            id SERIAL PRIMARY KEY,
            jsonData JSONB NOT NULL
          );
          `);

            console.log('Table "billpay" created successfully');
        } catch (error) {
            console.log('Error creating "billpay" table:', error);
        }
    };

    //insert Data Into Bill Pay
    async insertDataIntoBillPay(data) {
        try {
            this.model.connect();
            await this.model.query(
                `
      INSERT INTO billpay (jsonData) VALUES ($1)
    `,
                [data]
            );
            Logger.info("success");
        } catch (error) {
            Logger.error("error", error);
        }
    }

    // create table transaction
    createTransaction = async () => {
        try {
            this.model.connect();
            await this.model.query(`
          CREATE TABLE IF NOT EXISTS transaction (
            id SERIAL PRIMARY KEY,
            jsonData JSONB NOT NULL
          );
          `);

            console.log('Table "transaction" created successfully');
        } catch (error) {
            console.log('Error creating "transaction" table:', error);
        }
    };

    //insert Data Into BillTransaction
    async insertDataIntoBillTransaction(data) {
        try {
            this.model.connect();
            await this.model.query(
                `
      INSERT INTO transaction (jsonData) VALUES ($1)
    `,
                [data]
            );
            Logger.info("success");
        } catch (error) {
            Logger.error("error", error);
        }
    }
}

module.exports = new PayMent(CONSTANT.POSTGRES_DB);
