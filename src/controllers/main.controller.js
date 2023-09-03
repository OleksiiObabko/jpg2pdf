const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const {sharpTool} = require('../tools');

module.exports = {
	renderMainPage: (req, res, next) => {
		try {
			const {imagePaths} = req.session;

			if (imagePaths === undefined) {
				res.sendFile(path.join(__dirname, '..', '/public/html/index.html'));
			} else {
				res.render('index', {imagePaths});
			}
		} catch (e) {
			next(e);
		}
	},
	uploadImages: async (req, res, next) => {
		try {
			let files = req.files;
			let imagePaths = [];

			for (const file of files) {
				const filename = Date.now() + '.' + file.mimetype.split('/')[1];

				await sharpTool.rotateImage(file, 90);

				imagePaths.push(filename);
			}

			req.session.imagePaths = imagePaths;
			res.redirect('/');
		} catch (e) {
			next(e);
		}
	},
	convertToPdf: async (req, res, next) => {
		try {
			let body = req.body;
			let doc = new PDFDocument({size: 'A4', autoFirstPage: false});
			let pdfName = Date.now() + '.pdf';

			doc.pipe(fs.createWriteStream(path.join(__dirname, '..', `/public/pdf/${pdfName}`)));

			const pageWidth = 595.28; // Width of A4 page in points
			const pageHeight = 841.89; // Height of A4 page in points

			for (let name of body) {
				const imgPath = path.join(__dirname, '..', '/public/images/', name);
				const {width, height, x, y} = await sharpTool.getDimensions(imgPath, pageWidth, pageHeight);

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
