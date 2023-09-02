const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'src/public/images');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '.' + file.mimetype.split('/')[1]);
	},
});

let fileFilter = (req, file, callback) => {
	let ext = path.extname(file.originalname);
	if (ext !== '.png' && ext !== '.jpg') {
		return callback(new Error('Only png and jpg files are accepted'));
	} else {
		return callback(null, true);
	}
};

const upload = multer({storage, fileFilter: fileFilter});

module.exports = {upload};
