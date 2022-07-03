var express = require('express');

const pageController = require('../controllers/page/pageController');

var router = express.Router();

router.get('/', (req, res) => pageController.pageReadController.readAllPages(req, res));
router.get('/:page_id', (req, res) => pageController.pageReadController.readPage(req, res));

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
router.post('/',async (req, res) => await pageController.pageCreateController.createPage(req, res));

router.patch('/page_id/content', (req, res) => {
    pageController.pageUpdateController.updateContent(req, res);
})
router.patch('/:page_id/freeze_page', (req, res) => {
    pageController.pageUpdateController.updateFreezePage(req, res);
});

router.delete('/:page_id', (req, res) => pageController.pageDeleteController.deletePage(req, res));

module.exports = router;