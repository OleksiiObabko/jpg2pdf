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

router.post(
	'/pdf',
	mainController.convertToPdf,
);

router.get(
	'/new',
	mainController.newSession,
);

router.post(
	'/rotate',
	mainController.rotateSavedImg,
);

module.exports = router;
