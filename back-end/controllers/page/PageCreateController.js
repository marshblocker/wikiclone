// TODO: validate content in createPage and updateContent.

const shortid = require('shortid');

const CustomError = require('../../error');
const utils = require('../../utils');

class PageCreateController {
    constructor(pageDAO) {
        this.pageDAO = pageDAO;
    }

    async createPage(req, res) {
        try {
            // if (!req.parsedToken || !req.parsedToken.canEdit) {
            //     throw CustomError.ForbidCreatePage();
            // }

            const pageId = shortid.generate();
            const username = req.body['username'];
            const content = req.body['content'];
            if (!pageId) {
                throw CustomError.MissingRequiredURLParamAttr('page_id');
            }
            utils.checkUserInfo({ 'username': username }, ['username']);
            utils.checkPageContent(content);

            // To comply with JS naming convention.
            content.imageUrl = content.image_url;
            delete content.image_url;

            const result = await this._createPage(pageId, username, content);
            let newPage = result[0][0][0];
            newPage['freeze_page'] = (newPage['freeze_page'] === 1) ? true : false;

            // This is the expected response format.
            newPage.content = {
                title: newPage.title,
                image_url: newPage.image_url,
                lead: newPage.lead,
                body: newPage.body
            };
            delete newPage.title;
            delete newPage.image_url;
            delete newPage.lead;
            delete newPage.body;

            return res.status(200).json(newPage);
        } catch (error) {
            if (error.code) {
                return res.status(error.code).json({ 
                    custom_code: error.custom_code, 
                    message: error.message 
                });
            } else {
                console.log(error);
                return res.status(500).json(error);
            }
        }
    }

    async _createPage(pageId, username, content) {
        try {
            return await this.pageDAO.createPage(pageId, username, content);
        } catch (error) {
            throw error;
        }
    }

    // _createPage(newPageAttributes) {
    //     return new Promise((resolve, reject) => {
    //         const pageIDIndex = constants.page.ATTRIBUTES.indexOf('page_id');
    //         const requiredAttributeNames = constants.page.ATTRIBUTES.slice();

    //         // Temporary checking if the 'page_id' attribute was removed in the
    //         // requiredAttributeNames properly.
    //         const removedAttribute = requiredAttributeNames.splice(pageIDIndex, 1)[0]; 
    //         if (removedAttribute !== 'page_id') {
    //             return reject(CustomError.UnhandledError(
    //                 `Removed ${removedAttribute} instead of the page_id.`
    //             ));
    //         }

    //         // Reject the request if one of the required attributes is null, undefined, or empty string.
    //         for (let i = 0; i < requiredAttributeNames.length; i++) {
    //             const attributeName = requiredAttributeNames[i];
    //             const attributeValue = newPageAttributes[attributeName];
    //             if (attributeValue === undefined) {
    //                 return reject(CustomError.AttributeNotDefined(attributeName));
    //             }

    //             if ([null, ''].includes(attributeValue)) {
    //                 return reject(CustomError.InvalidAttributeValue(attributeName));
    //             }
    //         }

    //         // Reject the request if an unknown attribute name was included in the request body.
    //         const requestSpecifiedAttributeNames = Object.keys(newPageAttributes);
    //         for (let i = 0; i < requestSpecifiedAttributeNames.length; i++) {
    //             const attributeName = requestSpecifiedAttributeNames[i];
    //             if (!requiredAttributeNames.includes(attributeName)) {
    //                 return reject(CustomError.AttrDoesNotExist(attributeName));
    //             }
    //         }

    //         // Reject the request if the length of the given 'title' attribute exceeds its max length.
    //         if (newPageAttributes.title.length > constants.page.TITLE_MAX_LENGTH) {
    //             return reject(CustomError.AttrExceedsMaxLength(
    //                 { attributeName: 'title', maxLength: constants.page.TITLE_MAX_LENGTH }
    //                 ));
    //         }

    //         // Reject the request if the given 'freeze_page' attribute is not boolean type.
    //         if (typeof newPageAttributes.freeze_page !== 'boolean') {
    //             return reject(CustomError.InvalidAttributeType('freeze_page'));
    //         }

    //         this.pageDAO.createEntity(newPageAttributes)
    //         .then(newPage => {
    //             console.log(newPage);
    //             newPage.freeze_page = (newPage.freeze_page === 1) ? true : false;
    //             return resolve(newPage);
    //         })
    //         .catch(reject);
    //     });
    // }
}

module.exports = PageCreateController;