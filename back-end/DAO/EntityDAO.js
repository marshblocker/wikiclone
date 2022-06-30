const CustomError = require('../error');

class EntityDAO {
    constructor(table) {
        this.table = table;
    }

    createEntity(attributes) {
        return new Promise((resolve, reject) => {
            this.table.createEntry(attributes)
            .then(newEntity => resolve(newEntity[0][0][0]))
            .catch(error => reject(this.handleDBError(error)));
        })
    }

    readEntity(id) {
        return new Promise((resolve, reject) => {
            this.table.readEntry(id)
            .then(entity => resolve(entity[0][0][0]))
            .catch(error => reject(this.handleDBError(error)));
        });
    }

    readAllEntities() {
        return new Promise((resolve, reject) => {
            this.table.readAllEntries()
            .then(allEntities => resolve(allEntities[0][0]))
            .catch(error => reject(this.handleDBError(error)));
        });
    }

    updateEntity(id, newAttributes) {
        return new Promise((resolve, reject) => {
            this.table.updateEntry(id, newAttributes) 
            .then(updatedEntity => resolve(updatedEntity[0][0][0]))
            .catch(error => reject(this.handleDBError(error)));
        });
    }

    deleteEntity(id) {
        return new Promise((resolve, reject) => {
            this.table.deleteEntry(id)
            .then(deletedEntity => resolve(deletedEntity[0][0][0]))
            .catch(error => reject(this.handleDBError(error)));
        });
    }

    handleDBError(error) {
        // The sqlMessage was created by me.
        if (error.sqlMessage.includes(':')) {
            const [errorType, specific] = error.sqlMessage.split(':');
            if (errorType === 'ResourceDNE') {
                return CustomError.ResourceDoesNotExist(specific);
            }
            
            if (errorType === 'NullID') {
                return CustomError.MissingRequiredURLParamAttr(specific);
            }
        }

        if (error.errno === 1062) {
            const attributeName = getNameOfDupAttribute(error.sqlMessage)
            return CustomError.DuplicateAttributeValue(attributeName);

            function getNameOfDupAttribute(errorMessage) {
                const removedQuotes = errorMessage.split("'");
                return removedQuotes[removedQuotes.length - 2];
            }
        }

        return CustomError.UnhandledError(error);
    }
}

module.exports = EntityDAO;