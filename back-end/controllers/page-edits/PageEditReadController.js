const CustomError = require('../../error');
const utils = require('../../utils');

class PageEditReadController {
    constructor(pageEditDAO) {
        this.pageEditDAO = pageEditDAO;
    }

    async readPageEdit(req, res) {
        try {
            const pageEditId = req.params['page_edit_id'];
            if (!pageEditId) {
                throw CustomError.MissingRequiredURLParamAttr('page_edit_id');
            }

            const result = await this._readPageEdit(pageEditId);
            let pageEdit = result[0][0][0];
            pageEdit['freeze_page'] = (pageEdit['freeze_page'] === 1) ? true : false;

            const formattedPageEdit = utils.formatPageContent(pageEdit);

            return res.status(200).json(formattedPageEdit);
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

    async _readPageEdit(pageEditId) {
        try {
            return await this.pageEditDAO.readPageEdit(pageEditId);
        } catch (error) {
            throw error;
        }
    }

    async readPageEditByPageTitleAndPageVersion(pageTitle, pageVersion) {
        try {
            const result = await this._readPageEditByPageTitleAndPageVersion(pageTitle, pageVersion);
            let pageEdit = result[0][0][0];
            if (pageEdit == undefined) {
                throw CustomError.ResourceDoesNotExist('page edit');
            }
            pageEdit['freeze_page'] = (pageEdit['freeze_page'] === 1) ? true : false;

            const formattedPageEdit = utils.formatPageContent(pageEdit);

            return formattedPageEdit;
        } catch (error) {
            throw error;
        }
    }

    async _readPageEditByPageTitleAndPageVersion(pageTitle, pageVersion) {
        try {
            return await this.pageEditDAO.readPageEditByPageTitleAndPageVersion(pageTitle, pageVersion);
        } catch (error) {
            throw error;
        }
    }

    async readAllPageEdits(req, res) {
        try {
            const pageTitle = req.query['page_title'];
            const pageVersion = req.query['page_version'];
            const username = req.query['username'];
            const ret = req.query['return'];

            if (pageTitle && pageVersion) {
                const formattedPageEdit = await this.readPageEditByPageTitleAndPageVersion(pageTitle, pageVersion);
                return res.status(200).json(formattedPageEdit);
            }

            if (ret) {
                if (ret === 'latest_versions') {
                    const latestVersions = await this.readLatestVersionPerPages();
                    console.log(latestVersions);
                    return res.status(200).json(latestVersions);
                }
            }
            
            let result;
            if (pageTitle) {
                const offset = req.query['offset'];
                const limit = req.query['limit'];
                if (!offset || !limit) {
                    throw CustomError.MissingRequiredURLQueryAttr('offset or limit');
                }
                result = await this._readPageEditsByPageTitle(pageTitle, offset, limit);
            } else if (username) {
                const offset = req.query['offset'];
                const limit = req.query['limit'];
                if (!offset || !limit) {
                    throw CustomError.MissingRequiredURLQueryAttr('offset or limit');
                }
                result = await this._readUserPageEdits(username, offset, limit);
            } else {
                result = await this._readAllPageEdits();
            }
            const pageEdits = result[0][0];
            for (let i = 0; i < pageEdits.length; i++) {
                pageEdits[i]['freeze_page'] = 
                    (pageEdits[i]['freeze_page'] === 1) ? true : false; 

                // This is the expected response format.
                pageEdits[i].content = {
                    title: pageEdits[i].title,
                    image_url: pageEdits[i].image_url,
                    lead: pageEdits[i].lead,
                    body: pageEdits[i].body
                };
                delete pageEdits[i].title;
                delete pageEdits[i].image_url;
                delete pageEdits[i].lead;
                delete pageEdits[i].body;
            }
            return res.status(200).json(pageEdits);
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

    async readLatestVersionPerPages() {
        try {
            let result = await this.pageEditDAO.readLatestVersionPerPages();
            return result[0][0];
        } catch (error) {
            throw error;
        }
    }

    async _readPageEditsByPageTitle(pageTitle, offset, limit) {
        try {
            return await this.pageEditDAO.readPageEditsByPageTitle(pageTitle, offset, limit);
        } catch (error) {
            throw error;
        }
    }

    async _readUserPageEdits(username, offset, limit) {
        try {
            return await this.pageEditDAO.readUserPageEdits(username, offset, limit);
        } catch (error) {
            throw error;
        }
    }

    async _readAllPageEdits() {
        try {
            return await this.pageEditDAO.readAllPageEdits();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PageEditReadController;