const CustomError = require('../../error');
const constants = require('../../constants');

class PageUpdateController {
    constructor(pageDAO) {
        this.pageDAO = pageDAO;
    }

    updatePage(req, res) {
        this._updatePage(req.params.page_id, req.body)
            .then(page => res.status(200).json(page))
            .catch(error => res.status(error.code).json(error.message));
    }

    _updatePage(page_id, updatedPageAttributes) {
        return new Promise((resolve, reject) => {
            // Reject the request if page_id is undefined, null, or empty string.
            if ([undefined, '', null].includes(page_id)) {
                return reject(CustomError.MissingRequiredURLParamAttr('page_id'));
            }

            // Reject the request if the length of page_id is not equal to its assigned fixed length. 
            if (page_id.length !== constants.page.ID_FIXED_LENGTH) {
                return reject(CustomError.IDNotFixedLength(
                    {resourceName: 'page', fixed_length: constants.page.ID_FIXED_LENGTH}
                ));
            }

            this.pageDAO.readEntity(page_id)
            .then(currentPageAttributes => {
                currentPageAttributes.freeze_page = (currentPageAttributes.freeze_page === 1) ? true : false;

                const pageIDIndex = constants.page.ATTRIBUTES.indexOf('page_id');
                const requiredAttributeNames = constants.page.ATTRIBUTES.slice();
    
                // Temporary checking if the 'page_id' attribute was removed in the
                // requiredAttributeNames properly.
                const removedAttribute = requiredAttributeNames.splice(pageIDIndex, 1)[0]; 
                if (removedAttribute !== 'page_id') {
                    return reject(CustomError.UnhandledError(
                        `Removed ${removedAttribute} instead of the page_id.`
                    ));
                }
    
                // Reject the request if one of the required attributes is null, undefined, or empty string.
                for (let i = 0; i < requiredAttributeNames.length; i++) {
                    const attributeName = requiredAttributeNames[i];
                    const attributeValue = updatedPageAttributes[attributeName];
                    if (attributeValue === undefined) {
                        return reject(CustomError.AttributeNotDefined(attributeName));
                    }
    
                    if ([null, ''].includes(attributeValue)) {
                        return reject(CustomError.InvalidAttributeValue(attributeName));
                    }
                }
    
                // Reject the request if an unknown attribute name was included in the request body.
                const requestSpecifiedAttributeNames = Object.keys(updatedPageAttributes);
                for (let i = 0; i < requestSpecifiedAttributeNames.length; i++) {
                    const attributeName = requestSpecifiedAttributeNames[i];
                    if (!requiredAttributeNames.includes(attributeName)) {
                        return reject(CustomError.AttrDoesNotExist(attributeName));
                    }
                }
    
                // Reject the request if the length of the given 'title' attribute exceeds its max length.
                if (updatedPageAttributes.title.length > constants.page.TITLE_MAX_LENGTH) {
                    return reject(CustomError.AttrExceedsMaxLength(
                        { attributeName: 'title', maxLength: constants.page.TITLE_MAX_LENGTH }
                        ));
                }
    
                // Reject the request if the given 'freeze_page' attribute is not boolean type.
                if (typeof updatedPageAttributes.freeze_page !== 'boolean') {
                    return reject(CustomError.InvalidAttributeType('freeze_page'));
                }

                console.log(currentPageAttributes);
                console.log(updatedPageAttributes);

                let sameAttributeValues = true;
                for (let i = 0; i < requiredAttributeNames.length; i++) {
                    let attributeName = requiredAttributeNames[i];
                    if (currentPageAttributes[attributeName] !== updatedPageAttributes[attributeName]) {
                        sameAttributeValues = false;
                        break;
                    }
                }
                
                // Reject the request if the page's new attributes are the same with its
                // old attributes.
                if (sameAttributeValues) {
                    return reject(CustomError.NewSameWithOld('page'));
                }

                this.pageDAO.updateEntity(page_id, updatedPageAttributes)
                .then(updatedPage => {
                    updatedPage.freeze_page = (updatedPage.freeze_page === 1) ? true : false;
                    return resolve(updatedPage);
                })
                .catch(reject);    
            })
            .catch(error => {
                // We want the error to be ResourceDoesNotExist. But if it is not, we
                // check what the other possible error/s could be.
                if (error.message !== '404 Not Found: The given id does not correspond to an existing page in the database!') {
                    console.log(error);
                }

                return reject(error);
            });
        });
    }
}

module.exports = PageUpdateController;