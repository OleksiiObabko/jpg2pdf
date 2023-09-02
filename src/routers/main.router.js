const router = require('express').Router();

const {mainController} = require('../controllers');
const {multerTool} = require('../tools');

router.get(
	'/',
	mainController.renderMainPage,
);

router.post(
	'/upload',
	multerTool.upload.array('images'),
	mainController.uploadImages,
);

module.exports = router;
