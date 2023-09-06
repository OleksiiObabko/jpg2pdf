const router = require('express').Router();

const {mainController} = require('../controllers');
const {multerTool} = require('../tools');
const {imgMiddleware} = require('../middlewares');

router.get(
	'/',
	mainController.renderMainPage,
);

router.post(
	'/upload',
	multerTool.upload.array('images'),
	imgMiddleware.checkImg,
	mainController.uploadImages,
);

router.post(
	'/pdf',
	imgMiddleware.isBodyValid,
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
