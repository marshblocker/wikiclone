var express = require('express');

const pageController = require('../controllers/page/pageController');

var router = express.Router();

router.get('/', (req, res) => {
    // This does not necessarily return all the pages. The list could be filtered
    // based on the query parameters.
    pageController.pageReadController.readAllPages(req.query)
    .then(allPages => res.status(200).json(allPages))
    .catch(error => res.status(error.code).json(error.message));
})

router.get('/:page_id', (req, res) => {
    pageController.pageReadController.readPage(req.params.page_id)
    .then(page => res.status(200).json(page))
    .catch(error => res.status(error.code).json(error.message));
});

router.post('/', (req, res) => {
    pageController.pageCreateController.createPage(req.body)
    .then(page => res.status(201).json(page))
    .catch(error => res.status(error.code).json(error.message));
});

router.put('/:page_id', (req, res) => {
    pageController.pageUpdateController.updatePage(req.params.page_id, req.body)
    .then(page => res.status(200).json(page))
    .catch(error => res.status(error.code).json(error.message));
});

router.delete('/:page_id', (req, res) => {
    pageController.pageDeleteController.deletePage(req.params.page_id)
    .then(page => res.status(200).json(page))
    .catch(error => res.status(error.code).json(error.message));
})

module.exports = router;