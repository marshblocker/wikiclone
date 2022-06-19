const shortid = require('shortid');

const TableABC = require('./TableABC');
const knex = require('../knex');

class UsersTable extends TableABC {
    constructor(nullTable) {
        super(nullTable);
        this.knex = knex;
    }

    createEntry(attributes) {
        return new Promise((resolve, reject) => {
            const { username, password, email, role, can_edit } = attributes;
            const id = shortid.generate();
            knex.raw(
                'CALL create_user(?, ?, ?, ?, ?, ?)',
                [id, username, password, email, role, can_edit]
            )
            .then(resolve)
            .catch(reject);
        });
    }

    readEntry(id, strict) {
        return new Promise((resolve, reject) => {
            knex.raw('CALL read_user(?, ?)', [id, strict])
            .then(resolve)
            .catch(reject);
        });
    }
    
    readAllEntries(strict) {
        return new Promise((resolve, reject) => {
            knex.raw('CALL read_all_users(?)', [strict])
            .then(resolve)
            .catch(reject);
        });
    }

    updateEntry(id, newAttributes) {
        return new Promise((resolve, reject) => {
            const { username, password, email, role, can_edit } = newAttributes;
            knex.raw(
                'CALL update_user(?, ?, ?, ?, ?, ?)',
                [id, username, password, email, role, can_edit]
            )
            .then(resolve)
            .catch(reject);
        });
    }

    deleteEntry(id) {
        return new Promise((resolve, reject) => {
            console.log('Hi');
            knex.raw('CALL delete_user(?)', [id])
            .then(resolve)
            .catch(reject);
        });
    }
}

module.exports = UsersTable;