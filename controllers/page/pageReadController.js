const utils = require('../../utils');
let pages = require('../../database/pagesDatabase');

let pageReadController = {
    // TODO: Pagination and filtering.
    readPages: function(req, res) {
        const requiredParams = [];
        const validateRes = utils.validatePageRequiredParams(requiredParams, req.body, req.method, null);
        if (validateRes !== 'valid') {
            return res.status(validateRes.error.code).json(validateRes.error);
        }        

        let pagesRead = {};
        let pagesIDs = Object.keys(pages); 
        for (let i = 0; i < pagesIDs.length; i++) {
            let page = JSON.parse(JSON.stringify(pages[pagesIDs[i]]));
            delete page.content;
            pagesRead[pagesIDs[i]] = page;
        }
    
        return res.status(200).json(pagesRead);
    },

    readPage: function(req, res) {
        if (pages[req.params.page_id] === undefined) {
            const error = {
                code: 404,
                message: 'The given page does not exist!'
            };
            return res.status(error.code).json(error);
        }

        const requiredParams = [];
        const validateRes = utils.validatePageRequiredParams(requiredParams, req.body, req.method, null);
        if (validateRes !== 'valid') {
            return res.status(validateRes.error.code).json(validateRes.error);
        }

        if (Object.keys(req.query).length) {
            const attr = req.query.attr;
            const val = pages[req.params.page_id][attr];
            if (val === undefined) {
                const error = {
                    code: 400,
                    message: 'Page does not have the given attribute.'
                };
                return res.status(error.code).json(error);
            } else {
                const request = {};
                request[attr] = val;
                return res.status(200).json(request);
            }
        }
        
        let page = pages[req.params.page_id];
        return res.status(200).json(page);
    }
};

module.exports = pageReadController;