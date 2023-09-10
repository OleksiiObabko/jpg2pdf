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

			const deleteFilePromise = (dir, name) => {
				try {
					return unlink(path.join(dir, name));
				} catch (error) {
					throw new ApiError(`Error deleting ${name}:`, 500);
				}
			};

			if (imageNames?.length) {
				const deleteImgPromises = imageNames.map(imgName => deleteFilePromise(imgDir, imgName));
				await Promise.all(deleteImgPromises);
			}
			if (pdfNames?.length) {
				const deletePdfPromises = await pdfNames.map(pdfName => deleteFilePromise(pdfDir, pdfName));
				await Promise.all(deletePdfPromises);
			}

			delete req.session.imageNames;
			delete req.session.pdfNames;

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
