const router = require('express').Router();
const {mainController} = require('../controllers');

router.get('/', mainController.renderMainPage);
router.post('/upload', mainController.uploadImages);

module.exports = router;
