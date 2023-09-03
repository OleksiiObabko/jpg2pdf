const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

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

			files.map(file => imagePaths.push(file.filename));
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

			for (let name of body) {
				doc.addPage();
				doc.image(path.join(__dirname, '..', `/public/images/${name}`), {
					fit: [200, 200],
					align: 'center',
					valign: 'center',
					angle: 0,
				});
			}
			doc.end();

			res.send(`/pdf/${pdfName}`);
		} catch (e) {
			next(e);
		}
	},
};
