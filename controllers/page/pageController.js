const PagesTable = require('../../database/tables/PagesTable');
const PageDAO = require('../../DAO/PageDAO');
const PageReadController = require('../../controllers/page/PageReadController');
const PageCreateController = require('./PageCreateController');
const PageUpdateController = require('./PageUpdateController');
const PageDeleteController = require('./PageDeleteController');

class PageController {
    constructor(pageReadController, pageCreateController, 
                pageUpdateController, pageDeleteController) {
        this.pageReadController = pageReadController;
        this.pageCreateController = pageCreateController;
        this.pageUpdateController = pageUpdateController;
        this.pageDeleteController = pageDeleteController;
    }
}

let pagesTable = new PagesTable(null);
let pageDAO = new PageDAO(pagesTable);

let pageReadController = new PageReadController(pageDAO);
let pageCreateController = new PageCreateController(pageDAO);
let pageUpdateController = new PageUpdateController(pageDAO);
let pageDeleteController = new PageDeleteController(pageDAO);

let pageController = new PageController(
    pageReadController, pageCreateController, 
    pageUpdateController, pageDeleteController
);

module.exports = pageController;