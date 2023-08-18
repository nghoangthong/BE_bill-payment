// Abstract class Connection
class Connection {
    constructor(name) {
        if (new.target === Connection) {
            throw new TypeError('Abstract class "Connection" cannot be instantiated directly.');
        }
        this.name = name;
        this.pool = null;
    }

    // Abstract method to be implemented in derived classes
    connect() {
        throw new Error('Method "connect" must be implemented in the derived class.');
    }

    // Abstract method to be implemented in derived classes
    disconnect() {
        throw new Error('Method "disconnect" must be implemented in the derived class.');
    }

    // Abstract method to be implemented in derived classes
    query(text, params) {
        throw new Error('Method "query" must be implemented in the derived class.');
    }
}

module.exports = Connection;