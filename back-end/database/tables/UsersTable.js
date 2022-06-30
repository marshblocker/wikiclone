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
            const user_id = shortid.generate();
            knex.raw(
                'CALL create_user(?, ?, ?, ?, ?, ?)',
                [user_id, username, password, email, role, can_edit]
            )
            .then(resolve)
            .catch(reject);
        });
    }

    readEntry(user_id, strict) {
        return new Promise((resolve, reject) => {
            knex.raw('CALL read_user(?, ?)', [user_id, strict])
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

    updateEntry(user_id, newAttributes) {
        return new Promise((resolve, reject) => {
            const { username, password, email, role, can_edit } = newAttributes;
            knex.raw(
                'CALL update_user(?, ?, ?, ?, ?, ?)',
                [user_id, username, password, email, role, can_edit]
            )
            .then(resolve)
            .catch(reject);
        });
    }

    deleteEntry(user_id) {
        return new Promise((resolve, reject) => {
            console.log('Hi');
            knex.raw('CALL delete_user(?)', [user_id])
            .then(resolve)
            .catch(reject);
        });
    }
}

module.exports = UsersTable;