var express = require('express');
var router = express.Router();

const pageCreateController = require('../controllers/page/pageCreateController');
const pageReadController = require('../controllers/page/pageReadController');
const pageUpdateController = require('../controllers/page/pageUpdateController');
const pageDeleteController = require('../controllers/page/pageDeleteController');

// Required body parameters: none.
router.get('/', pageReadController.readPages);

// Required body parameters: none.
// Can append 'attr' query parameter to get a specific attribute value
// of a given user. For example, /users/ABC?attr=title, to get
// the title of the page with page_id ABC.
router.get('/:page_id', pageReadController.readPage);

// Required body parameters: 'title', 'content', 'user_id' (of the creator).
router.post('/', pageCreateController.createPage);

// Required body parameter (ONLY one of the following): 'title', 'content', 'version','user_id'.
// If 'user_id', the 'contributors' attribute will be appended (if not yet so) with 'user_id'.
router.patch('/:page_id', pageUpdateController.updatePage);

// Required body parameters: none.
router.delete('/:page_id', pageDeleteController.deletePage);

module.exports = router;