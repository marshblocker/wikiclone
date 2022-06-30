const EntityDAO = require('./EntityDAO');

class UserDAO extends EntityDAO {
    readEntity(id, strict) {
        return new Promise((resolve, reject) => {
            this.table.readEntry(id, strict)
            .then(user => resolve(user[0][0][0]))
            .catch(error => reject(this.handleDBError(error)));
        });
    }

    readAllEntities(strict) {
        return new Promise((resolve, reject) => {
            this.table.readAllEntries(strict)
            .then(allUsers => resolve(allUsers[0][0]))
            .catch(error => reject(this.handleDBError(error)));
        });
    }
}


module.exports = UserDAO;