var express = require('express');

const pageController = require('../controllers/page/pageController');

var router = express.Router();

// This does not necessarily return all the pages. The list could be filtered
// based on the query parameters.
router.get('/', (req, res) => pageController.pageReadController.readAllPages(req, res));

router.get('/:page_id', (req, res) => pageController.pageReadController.readPage(req, res));

router.post('/', (req, res) => pageController.pageCreateController.createPage(req, res));

router.put('/:page_id', (req, res) => pageController.pageUpdateController.updatePage(req, res));

router.delete('/:page_id', (req, res) => pageController.pageDeleteController.deletePage(req, res));

module.exports = router;