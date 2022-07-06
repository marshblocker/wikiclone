const CustomError = require('../../error');

class PageDeleteController {
    constructor(pageDAO) {
        this.pageDAO = pageDAO;
    }

    async deletePage(req, res) {
        try {
            // if (!req.parsedToken || req.parsedToken.role === 'user' || !req.parsedToken.canEdit) {
            //     throw CustomError.ForbidDeletePage();
            // }

            const pageId = req.params['page_id'];
            if (!pageId) {
                throw CustomError.MissingRequiredURLParamAttr('page_id');
            }

            const result = await this._deletePage(pageId);
            let deletedPage = result[0][0][0];
            deletedPage['freeze_page'] = (deletedPage['freeze_page'] === 1) ? true : false;
            
            // This is the expected response format.
            deletedPage = {
                page_id: deletedPage.page_id,
                page_version: deletedPage.page_version,
                freeze_page: deletedPage.freeze_page,
                content: {
                    title: deletedPage.title,
                    image_url: deletedPage.image_url,
                    lead: deletedPage.lead,
                    body: deletedPage.body
                }
            };
            return res.status(200).json(deletedPage);
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

    async _deletePage(pageId) {
        try {
            return await this.pageDAO.deletePage(pageId);
        } catch (error) {
            throw error;
        }
    }

    // _deletePage(page_id) {
    //     return new Promise((resolve, reject) => {
    //         // Reject the request if page_id is undefined, null, or empty string.
    //         if ([undefined, '', null].includes(page_id)) {
    //             return reject(CustomError.MissingRequiredURLParamAttr('page_id'));
    //         }

    //         // Reject the request if the length of page_id is not equal to its assigned fixed length. 
    //         if (page_id.length !== constants.page.ID_FIXED_LENGTH) {
    //             return reject(CustomError.IDNotFixedLength(
    //                 {resourceName: 'page', fixed_length: constants.page.ID_FIXED_LENGTH}
    //             ));
    //         }

    //         this.pageDAO.deleteEntity(page_id)
    //         .then(deletedPage => {
    //             deletedPage.freeze_page = (deletedPage.freeze_page === 1) ? true : false;
    //             return resolve(deletedPage);
    //         })
    //         .catch(reject);
    //     });
    // }
}

module.exports = PageDeleteController