const path = require('path');
const fs = require('fs');
const {access, mkdir, unlink} = require('fs/promises');
const PDFDocument = require('pdfkit');

const {sharpTool} = require('../tools');
const {htmlDir, imgDir, pdfDir} = require('../enums/path.enum');
const {ApiError} = require('../errors');

module.exports = {
	renderMainPage: (req, res, next) => {
		try {
			const {imageNames} = req.session;

			if (imageNames === undefined) {
				res.sendFile(path.join(htmlDir, 'index.html'));
			} else {
				res.render('index', {imageNames});
			}
		} catch (e) {
			next(e);
		}
	},
	uploadImages: async (req, res, next) => {
		try {
			let files = req.files;
			let imageNames = [];

			for (const file of files) {
				const filename = Date.now() + '.' + file.mimetype.split('/')[1];

				await sharpTool.rotateImgBeforeSave(file, 90);

				imageNames.push(filename);
			}

			req.session.imageNames = imageNames;
			res.redirect('/');
		} catch (e) {
			next(e);
		}
	},
	convertToPdf: async (req, res, next) => {
		try {
			const body = req.body;
			const doc = new PDFDocument({size: 'A4', autoFirstPage: false});
			const pdfName = Date.now() + '.pdf';

			const pageWidth = 595.28; // A4
			const pageHeight = 841.89; // A4

			// create pdf dir in not exists
			try {
				await access(pdfDir);
			} catch (e) {
				await mkdir(pdfDir);
			}

			doc.pipe(fs.createWriteStream(path.join(pdfDir, pdfName)));

			for (const name of body) {
				const imgPath = path.join(imgDir, name);
				const {width, height, x, y} = await sharpTool.getDimensions(
					imgPath,
					pageWidth,
					pageHeight,
				);

				doc.addPage();
				doc.image(imgPath, x, y, {
					width,
					height,
				});
			}
			doc.end();

			if (!req.session.pdfNames) {
				req.session.pdfNames = [];
			}
			req.session.pdfNames.push(pdfName);

			res.send(`/pdf/${pdfName}`);
		} catch (e) {
			next(e);
		}
	},
	newSession: async (req, res, next) => {
		try {
			const {imageNames, pdfNames} = req.session;

			const deleteFiles = async (filenames, type) => {
				let deleting;

				if (type === 'img') {
					deleting = filenames.map((filename) => unlink(path.join(imgDir, filename)));
				} else if (type === 'pdf') {
					deleting = filenames.map((filename) => unlink(path.join(pdfDir, filename)));
				}

				await Promise.all(deleting);
			};

			deleteFiles(imageNames, 'img').then();
			deleteFiles(pdfNames, 'pdf').then();

			req.session.imageNames = undefined;
			req.session.pdfNames = undefined;

			res.redirect('/');
		} catch (e) {
			next(e);
		}
	},
	rotateSavedImg: async (req, res, next) => {
		try {
			const imgName = req.body.imgName;

			if (!imgName) {
				return next(new ApiError('imgName is required', 400));
			} else if (typeof imgName !== 'string') {
				return next(new ApiError('imgName must be string', 400));
			}

			await sharpTool.rotateImgAfterSave(req.body.imgName);

			res.sendStatus(200);
		} catch (e) {
			next(e);
		}
	},
};
