const Models = require('./Model');
class PostModel extends Models {
    // protected pool: Pool;
    constructor(dbType) { 
        super(dbType);
    }

    async getAll() {
        const query = 'SELECT * FROM posts';
        try {
            this.model.connect();
            const result = await this.model.query(query);

            return result.rows;
        } catch (err) {
            console.error('Error fetching posts', err);
            throw err;
        }
    }
}

module.exports = new PostModel(global.CONSTANT.POSTGRES_DB);