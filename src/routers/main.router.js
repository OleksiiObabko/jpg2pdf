const router = require('express').Router();
const {mainController} = require('../controllers');

router.get('/', mainController.renderMainPage);

module.exports = router;
