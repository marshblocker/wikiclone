const CustomError = require('../../error');
const constants = require('../../constants');

class PageDeleteController {
    constructor(pageDAO) {
        this.pageDAO = pageDAO;
    }

    deletePage(page_id) {
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

            this.pageDAO.deleteEntity(page_id)
            .then(deletedPage => {
                deletedPage.freeze_page = (deletedPage.freeze_page === 1) ? true : false;
                return resolve(deletedPage);
            })
            .catch(reject);
        });
    }
}

module.exports = PageDeleteController