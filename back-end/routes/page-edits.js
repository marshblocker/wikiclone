var express = require('express');
const utils = require('../utils');

const PageEditDAO = require('../DAO/PageEditDAO');
const PageEditCreateController = require('../controllers/page-edits/PageEditCreateController');
const PageEditReadController = require('../controllers/page-edits/PageEditReadController');
const PageEditUpdateController = require('../controllers/page-edits/PageEditUpdateController');
const PageEditDeleteController = require('../controllers/page-edits/PageEditDeleteController');

const pageEditDAO = new PageEditDAO();
const pageEditCreateController = new PageEditCreateController(pageEditDAO);
const pageEditReadController = new PageEditReadController(pageEditDAO);
const pageEditUpdateController = new PageEditUpdateController(pageEditDAO);
const pageEditDeleteController = new PageEditDeleteController(pageEditDAO);

var router = express.Router();

router.get('/:page_edit_id', async (req, res) => await pageEditReadController.readPageEdit(req, res));
router.get('/', async (req, res) => await pageEditReadController.readAllPageEdits(req, res));

router.use(utils.parseToken);

router.post('/', async (req, res) => await pageEditCreateController.createPageEdit(req, res));

router.patch('/:page_edit_id/edit_summary', async (req, res) => await pageEditUpdateController.updateEditSummary(req, res));

router.delete('/:page_edit_id', async (req, res) => await pageEditDeleteController.deletePageEdit(req, res));

module.exports = router;