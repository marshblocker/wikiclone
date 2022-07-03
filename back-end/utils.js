const CustomError = require('./error');

const utils = {
    checkContent(content) {
        if (!content) {
            throw CustomError.InvalidAttributeValue('content');
        }
        if (!content.title || typeof content.title !== 'string') {
            throw CustomError.InvalidAttributeValue('content.title');
        }      
        if (typeof content.image_url !== 'string') {
            throw CustomError.InvalidAttributeValue('content.image_url');
        }
        if (!content.lead) {
            throw CustomError.InvalidAttributeValue('content.lead');
        }
        if (!content.body) {
            throw CustomError.InvalidAttributeValue('content.body');
        }
    }
}

module.exports = utils;