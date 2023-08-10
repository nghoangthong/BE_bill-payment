const Models = require("./Model");
class PayMent extends Models {
  // protected pool: Pool;
  constructor(dbType) {
    super(dbType);
  }

  createBillCheck = async () => {
    try {
      this.model.connect();
      await this.model.query(`
          CREATE TABLE IF NOT EXISTS BillCheck (
            id SERIAL PRIMARY KEY,
            jsonData JSONB NOT NULL
          );
          `);

      console.log('Table "bill_data" created successfully');
    } catch (error) {
      console.log('Error creating "bill_data" table:', error);
    }
  };

  async insertDataIntoBillCheck(data) {
    try {
      this.model.connect();
      await this.model.query(
        `
      INSERT INTO billcheck (jsonData) VALUES ($1)
    `,
        [data]
      );
      console.log("thành công");
      Logger.info("success");
    } catch (error) {
      console.log("lụm");
      Logger.error("error", error);
    }
  }
}

module.exports = new PayMent(global.CONSTANT.POSTGRES_DB);
