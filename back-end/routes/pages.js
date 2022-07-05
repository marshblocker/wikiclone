var express = require('express');

const PageDAO = require('../DAO/PageDAO');
const PageCreateController = require('../controllers/page/PageCreateController');
const PageReadController = require('../controllers/page/PageReadController');
const PageUpdateController = require('../controllers/page/PageUpdateController');
const PageDeleteController = require('../controllers/page/PageDeleteController');

const pageDAO = new PageDAO();
const pageCreateController = new PageCreateController(pageDAO);
const pageReadController = new PageReadController(pageDAO);
const pageUpdateController = new PageUpdateController(pageDAO);
const pageDeleteController = new PageDeleteController(pageDAO);

// const utils = require('../utils');

var router = express.Router();

// router.use(utils.parseToken);

router.get('/', (req, res) => pageReadController.readAllPages(req, res));
router.get('/:page_id', (req, res) => pageReadController.readPage(req, res));

/*
    Post request body structure:
        {
            "page_id": ...,
            "content": {
                "title": ...,
                "image_url": ...,
                "lead": ...,
                "body": ...
            }
        }
*/
router.post('/',async (req, res) => await pageCreateController.createPage(req, res));

router.patch('/:page_id/content', (req, res) => {
    pageUpdateController.updateContent(req, res);
});
router.patch('/:page_id/freeze_page', (req, res) => {
    pageUpdateController.updateFreezePage(req, res);
});

router.delete('/:page_id', (req, res) => pageDeleteController.deletePage(req, res));

module.exports = router;