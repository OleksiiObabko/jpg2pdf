const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const {sharpTool} = require('../tools');
const {htmlDir, imgDir, pdfDir} = require('../enums/path.enum');

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

				await sharpTool.rotateImage(file, 90);

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

			res.send(`/pdf/${pdfName}`);
		} catch (e) {
			next(e);
		}
	},
};
