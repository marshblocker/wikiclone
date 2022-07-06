// TODO: Implement request query parameters.

const CustomError = require('../../error');

class PageReadController {
    constructor(pageDAO) {
        this.pageDAO = pageDAO
    }

    async readPage(req, res) {
        try {
            const pageId = req.params['page_id'];
            if (!pageId) {
                throw CustomError.MissingRequiredURLParamAttr('page_id');
            }

            const result = await this._readPage(pageId);
            let page = result[0][0][0];
            page['freeze_page'] = (page['freeze_page'] === 1) ? true : false;

            // This is the expected response format.
            page.content = {
                title: page.title,
                image_url: page.image_url,
                lead: page.lead,
                body: page.body
            };
            delete page.title;
            delete page.image_url;
            delete page.lead;
            delete page.body;

            return res.status(200).json(page);
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

    async _readPage(pageId) {
        try {
            return await this.pageDAO.readPage(pageId);
        } catch (error) {
            throw error;
        }
    }

    // _readPage(page_id, query) {
    //     return new Promise((resolve, reject) => {
    //         let desiredAttributes = [];

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

    //         const queryNames = Object.keys(query);
    //         if (queryNames.length > 0) {
    //             const validQueryNames = ['attr'];
    //             for (let i = 0; i < queryNames.length; i++) {
    //                 // Reject the request if one of the query parameters is
    //                 // not officially considered to be valid.
    //                 if (!validQueryNames.includes(queryNames[i])) {
    //                     return reject(CustomError.InvalidQueryParameterName(queryNames[i]));
    //                 }
    //             }

    //             if (query.attr !== undefined) {
    //                 if (query.attr.constructor.name === 'Array') {
    //                     for (let i = 0; i < query.attr.length; i++) {
    //                         if (!desiredAttributes.includes(query.attr[i])) {
    //                             desiredAttributes.push(query.attr[i]);
    //                         }
    //                     }
    //                 } else {
    //                     desiredAttributes.push(query.attr);
    //                 }

    //                 for (let i = 0; i < desiredAttributes.length; i++) {
    //                     // Reject the request if the attribute specified in the query
    //                     // is not an attribute of a page.
    //                     if (!constants.page.ATTRIBUTES.includes(desiredAttributes[i])) {
    //                         return reject(CustomError.InvalidQueryParameterValue(desiredAttributes[i]));
    //                     }
    //                 }
    //             }
    //         }

    //         this.pageDAO.readEntity(page_id)
    //         .then(page => {
    //             page.freeze_page = (page.freeze_page === 1) ? true : false;
    //             if (desiredAttributes.length === 0) {
    //                 return resolve(page);
    //             }

    //             let finalPage = {};
    //             for (let i = 0; i < desiredAttributes.length; i++) {
    //                 let attributeName = desiredAttributes[i];
    //                 finalPage[attributeName] = page[attributeName];
    //             }

    //             return resolve(finalPage);
    //         })
    //         .catch(reject);
    //     });
    // }

    async readAllPages(req, res) {
        try {
            const result = await this._readAllPages();
            const pages = result[0][0];
            for (let i = 0; i < pages.length; i++) {
                pages[i]['freeze_page'] = (pages[i]['freeze_page'] === 1) ? true : false; 

                // This is the expected response format.
                pages[i].content = {
                    title: pages[i].title,
                    image_url: pages[i].image_url,
                    lead: pages[i].lead,
                    body: pages[i].body
                };
                delete pages[i].title;
                delete pages[i].image_url;
                delete pages[i].lead;
                delete pages[i].body;
            }
            return res.status(200).json(pages);
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

    async _readAllPages() {
        try {
            return await this.pageDAO.readAllPages();
        } catch (error) {
            throw error;
        }
    }

    // _readAllPages(query) {
    //     return new Promise((resolve, reject) => {   
    //         let outputFormat = {};

    //         const queryNames = Object.keys(query);
    //         if (queryNames.length > 0) {
    //             let filter = {};
    //             let sort_by = {};
    //             let paging = {};

    //             // Reject the request if an unknown query name was found.
    //             const validQueryNames = ['freeze_page', 'sort_by', 'page', 'page_entries'];
    //             for (let i = 0; i < queryNames.length; i++) {
    //                 if (!validQueryNames.includes(queryNames[i])) {
    //                     return reject(CustomError.InvalidQueryParameterName(queryNames[i]));
    //                 }
    //             }
    
    //             if (query.freeze_page !== undefined) {
    //                 // Reject the request if freeze_page query is not boolean.
    //                 if (!['true', 'false'].includes(query.freeze_page)) {
    //                     return reject(CustomError.InvalidCanEditFilter(query.freeze_page));
    //                 }
    //                 filter.byFreezePage = (query.freeze_page === 'true') ? true : false;
    //             }
    
    //             const allowedAttributesForSorting = ['page_id', 'title', 'freeze_page'];
    
    //             if (query.sort_by !== undefined) {
    //                 sort_by = {
    //                     attr: query.sort_by.slice(1),
    //                     ascending: query.sort_by.startsWith('-') ? false : true
    //                 }
                    
    //                 // Reject the request if a paramater not suitable for sorting
    //                 // was given in the sort_by query parameter.
    //                 if (!allowedAttributesForSorting.includes(sort_by.attr)) {
    //                     return reject(CustomError.InvalidSortBy(sort_by.attr));
    //                 }
    //             }
    
    //             // Reject the request if strictly one of page and page_entries parameter
    //             // is undefined.
    //             if (Number(query.page !== undefined) + Number(query.page_entries !== undefined) == 1) {
    //                 return reject(CustomError.MissingPagingParameter());
    //             }
    
    //             if (query.page !== undefined && query.page_entries !== undefined) {
    //                 paging.page_entries = +query.page_entries;
    //                 paging.page = +query.page;
                    
    //                 // Reject the request if the page or page entries query parameter
    //                 // were not positive (non-zero) integer.
    //                 if (isNaN(paging.page) || isNaN(paging.page_entries) || paging.page <= 0 || 
    //                         paging.page_entries <= 0 || paging.page % 1 !== 0 || paging.page_entries % 1 !== 0) {
    //                     return reject(CustomError.InvalidPaging());
    //                 }
    //             }
    
    //             outputFormat = {"filter": filter, "sort_by": sort_by, "paging": paging};
    //         }

    //         this.pageDAO.readAllEntities()
    //         .then(allPages => {
    //             allPages.forEach(user => user.freeze_page = (user.freeze_page === 1) ? true : false);
                
    //             // Return the result immediately if the result does not need to be
    //             // formatted since no query parameters were specified.
    //             if (queryNames.length === 0) {
    //                 return resolve(allPages);
    //             }

    //             let formattedPagesArray = allPages;
                
    //             if (outputFormat.filter.byFreezePage !== undefined) {
    //                 formattedPagesArray = allPages.filter(
    //                     page => page.freeze_page === outputFormat.filter.byFreezePage
    //                 );
    //             }
                        
    //             if (outputFormat.sort_by.attr !== undefined) {
    //                 const attribute = outputFormat.sort_by.attr;
    //                 const ascending = outputFormat.sort_by.ascending;
    //                 if (attribute === 'freeze_page') {
    //                     formattedPagesArray.sort((a, b) => a[attribute] - b[attribute]);
    //                 } else {
    //                     formattedPagesArray.sort(function(a, b) {
    //                         return ('' + a[attribute]).localeCompare(b[attribute]);
    //                     })
    //                 }
    //                 if (!ascending) {
    //                     formattedPagesArray.reverse();
    //                 }
    //             }
                
    //             const formattedPagesTotalAmount = formattedPagesArray.length;
    //             if (outputFormat.paging.page !== undefined && formattedPagesTotalAmount !== 0) {
    //                 const page = outputFormat.paging.page - 1;
    //                 const page_entries = outputFormat.paging.page_entries;
    //                 const startIndex = page*page_entries;

    //                 // Reject the request if the combination of page and page_entries
    //                 // parameter will exceed the page limit.
    //                 if (startIndex >= formattedPagesTotalAmount) {
    //                     return reject(CustomError.ReachedPageLimit());
    //                 }
                    
    //                 formattedPagesArray.splice(0, startIndex);
    //                 formattedPagesArray.splice(page_entries);
    //             }

    //             return resolve(formattedPagesArray);
    //         })
    //         .catch(reject);
    //     })
    // }
}

module.exports = PageReadController;