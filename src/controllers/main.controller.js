const path = require('path');
const fs = require('fs');

module.exports = {
	renderMainPage: async (req, res, next) => {
		try {
			res.sendFile(path.join(__dirname, '..', '/public/html/index.html'));
		} catch (e) {
			next(e);
		}
	},
	uploadImages: async (req, res, next) => {
		try {
			const [images] = Object.values(req.files);
			const directory = path.join(__dirname, '../public/images');
			const imagePaths = [];

			if (!fs.existsSync(directory)) {
				fs.mkdirSync(directory, {recursive: true});
			}

			for (const image of images) {
				const extension = path.extname(image.name);
				const filePath = path.join(directory, `${Date.now()}${extension}`);

				fs.writeFileSync(filePath, image.data);
				imagePaths.push(filePath);
			}

			req.session.imagePaths = imagePaths;
			res.redirect('/');
		} catch (e) {
			next(e);
		}
	},
};
