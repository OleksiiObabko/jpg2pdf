const path = require('path');

module.exports = {
	renderMainPage: (req, res, next) => {
		try {
			const {imagePaths} = req.session;

			if (imagePaths === undefined) {
				res.sendFile(path.join(__dirname, '..', '/public/html/index.html'));
			} else {
				res.sendFile(path.join(__dirname, '..', '/public/html/index.html'));

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
};
