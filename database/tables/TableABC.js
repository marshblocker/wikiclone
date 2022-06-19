class TableABC {
    constructor(table) {
        if (this.constructor === TableABC) {
            throw new Error('Cannot instantiate an Abstract Base Class!');
        }

        this.table = table;
    }

    createEntry(attributes) {
        attributes;
        throw new Error("Method 'addEntry()' must be implemented.");
    }

    readEntry(id) {
        id;
        throw new Error("Method 'readEntry()' must be implemented.");
    }

    readAllEntries() {
        throw new Error("Method 'readAllEntries()' must be implemented.");
    }

    updateEntry(id, newAttributes) {
        id; newAttributes;
        throw new Error("Method 'updateEntry()' must be implemented.");
    }

    deleteEntry(id) {
        id;
        throw new Error("Method 'deleteEntry()' must be implemented.");
    }
}

module.exports = TableABC;