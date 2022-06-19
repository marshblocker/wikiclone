const shortid = require('shortid');

const TableABC = require('./TableABC');
const knex = require('../knex');

class PagesTable extends TableABC {
    constructor(nullTable) {
        super(nullTable);
        this.knex = knex;
    }

    createEntry(attributes) {
        return new Promise((resolve, reject) => {
            const { title, content, freeze_page } = attributes;
            console.log(freeze_page);
            const page_id = shortid.generate();
            knex.raw(
                'CALL create_page(?, ?, ?, ?)',
                [page_id, title, content, freeze_page]
            )
            .then(resolve)
            .catch(reject);
        });
    }

    readEntry(page_id) {
        return new Promise((resolve, reject) => {
            knex.raw('CALL read_page(?)', [page_id])
            .then(resolve)
            .catch(reject);
        });
    }
    
    readAllEntries() {
        return new Promise((resolve, reject) => {
            knex.raw('CALL read_all_pages()')
            .then(resolve)
            .catch(reject);
        });
    }

    updateEntry(page_id, newAttributes) {
        return new Promise((resolve, reject) => {
            const { title, content, freeze_page } = newAttributes;
            knex.raw(
                'CALL update_page(?, ?, ?, ?)',
                [page_id, title, content, freeze_page]
            )
            .then(resolve)
            .catch(reject);
        });
    }

    deleteEntry(page_id) {
        return new Promise((resolve, reject) => {
            knex.raw('CALL delete_page(?)', [page_id])
            .then(resolve)
            .catch(reject);
        });
    }
}

module.exports = PagesTable;