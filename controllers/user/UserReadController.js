const CustomError = require('../../error');
const constants = require('../../constants');

class UserReadController {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    readUser(user_id) {
        return new Promise((resolve, reject) => {
            // Reject the request if user_id is undefined, null, or empty string.
            if ([undefined, '', null].includes(user_id)) {
                return reject(CustomError.MissingRequiredURLParamAttr('user_id'));
            }

            // Reject the request if the length of user_id is not equal to its assigned fixed length. 
            if (user_id.length !== constants.user.ID_FIXED_LENGTH) {
                return reject(CustomError.IDNotFixedLength(
                    {resourceName: 'user', fixed_length: constants.user.ID_FIXED_LENGTH}
                ));
            }

            // TODO: determine how strict variable will be initialized.
            const strict = true;
            this.userDAO.readEntity(user_id, strict)
            .then(user => {
                user.can_edit = (user.can_edit === 1) ? true : false;
                return resolve(user);
            })
            .catch(reject);
        });
    }

    readAllUsers(query) {
        return new Promise((resolve, reject) => {   
            let strict = true;
            let outputFormat = {};

            const queryNames = Object.keys(query);
            if (queryNames.length > 0) {
                let filter = {};
                let sort_by = {};
                let paging = {};

                // Reject the request if an unknown query name was found.
                const validQueryNames = ['role', 'can_edit', 'sort_by', 'page', 'page_entries', 'strict'];
                for (let i = 0; i < queryNames.length; i++) {
                    if (!validQueryNames.includes(queryNames[i])) {
                        return reject(CustomError.InvalidQueryParameterName(queryNames[i]));
                    }
                }
    
                if (query.role !== undefined) {
                    // Reject the request if an invalid role query was given.
                    // Must only be 'user', 'admin', or 'superadmin'.
                    if (!constants.user.VALID_ROLES.includes(query.role)) {
                        return reject(CustomError.InvalidRoleFilter(query.role));
                    }
                    filter.byRole = query.role;
                }
    
                if (query.can_edit !== undefined) {
                    // Reject the request if can_edit query is not boolean.
                    if (!['true', 'false'].includes(query.can_edit)) {
                        return reject(CustomError.InvalidCanEditFilter(query.can_edit));
                    }
                    filter.byCanEdit = (query.can_edit === 'true') ? true : false;
                }

                if (query.strict !== undefined) {
                    // Reject the request if strict query is not boolean.
                    if (!['true', 'false'].includes(query.strict)) {
                        return reject(CustomError.InvalidStrictQueryParameter(query.strict));
                    }
                    strict = (query.strict === 'true') ? true : false;
                }
    
                const allowedAttributesForSorting = [
                    'user_id', 'username', 'email', 'role', 'can_edit'
                ];
    
                if (query.sort_by !== undefined) {
                    sort_by = {
                        attr: query.sort_by.slice(1),
                        ascending: query.sort_by.startsWith('-') ? false : true
                    }
                    
                    // Reject the request if a paramater not suitable for sorting
                    // was given in the sort_by query parameter.
                    if (!allowedAttributesForSorting.includes(sort_by.attr)) {
                        return reject(CustomError.InvalidSortBy(sort_by.attr));
                    }
                }
    
                // Reject the request if strictly one of page and page_entries parameter
                // is undefined.
                if (Number(query.page !== undefined) + Number(query.page_entries !== undefined) == 1) {
                    return reject(CustomError.MissingPagingParameter());
                }
    
                if (query.page !== undefined && query.page_entries !== undefined) {
                    paging.page_entries = +query.page_entries;
                    paging.page = +query.page;
                    
                    // Reject the request if the page or page entries query parameter
                    // were not positive (non-zero) integer.
                    if (isNaN(paging.page) || isNaN(paging.page_entries) || paging.page <= 0 || 
                            paging.page_entries <= 0 || paging.page % 1 !== 0 || paging.page_entries % 1 !== 0) {
                        return reject(CustomError.InvalidPaging());
                    }
                }
    
                outputFormat = {"filter": filter, "sort_by": sort_by, "paging": paging};
            }

            this.userDAO.readAllEntities(strict)
            .then(allUsers => {
                allUsers.forEach(user => user.can_edit = (user.can_edit === 1) ? true : false);
                
                // Return the result immediately if the result does not need to be
                // formatted since no query parameters were specified.
                if (queryNames.length === 0) {
                    return resolve(allUsers);
                }

                let formattedUsersArray = allUsers;
                
                if (outputFormat.filter.byCanEdit !== undefined) {
                    formattedUsersArray = allUsers.filter(
                        user => user.can_edit === outputFormat.filter.byCanEdit
                    );
                }
                    
                if (outputFormat.filter.byRole !== undefined) {
                    formattedUsersArray = formattedUsersArray.filter(
                        user => user.role === outputFormat.filter.byRole
                    );
                }
                        
                if (outputFormat.sort_by.attr !== undefined) {
                    const attribute = outputFormat.sort_by.attr;
                    const ascending = outputFormat.sort_by.ascending;
                    console.log(ascending);
                    if (attribute === 'can_edit') {
                        formattedUsersArray.sort((a, b) => a[attribute] - b[attribute]);
                    } else {
                        formattedUsersArray.sort(function(a, b) {
                            return ('' + a[attribute]).localeCompare(b[attribute]);
                        })
                    }
                    if (!ascending) {
                        formattedUsersArray.reverse();
                    }
                }
                
                const formattedUsersTotalAmount = formattedUsersArray.length;
                if (outputFormat.paging.page !== undefined && formattedUsersTotalAmount !== 0) {
                    const page = outputFormat.paging.page - 1;
                    const page_entries = outputFormat.paging.page_entries;
                    const startIndex = page*page_entries;

                    // Reject the request if the combination of page and page_entries
                    // parameter will exceed the page limit.
                    if (startIndex >= formattedUsersTotalAmount) {
                        return reject(CustomError.ReachedPageLimit());
                    }
                    
                    formattedUsersArray.splice(0, startIndex);
                    formattedUsersArray.splice(page_entries);
                }

                return resolve(formattedUsersArray);
            })
            .catch(reject);
        })
    }
}

module.exports = UserReadController;