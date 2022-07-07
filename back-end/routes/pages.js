var express = require('express');
const utils = require('../utils');

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

var router = express.Router();

router.get('/:page_id', async (req, res) => await pageReadController.readPage(req, res));
router.get('/', async (req, res) => await pageReadController.readAllPages(req, res));

router.use(utils.parseToken);

router.post('/', async (req, res) => await pageCreateController.createPage(req, res));

router.patch('/:page_id/content', async (req, res) => {
    await pageUpdateController.updateContent(req, res);
});
router.patch('/:page_id/freeze_page', async (req, res) => {
    await pageUpdateController.updateFreezePage(req, res);
});

router.delete('/:page_id', async (req, res) => await pageDeleteController.deletePage(req, res));

module.exports = router;