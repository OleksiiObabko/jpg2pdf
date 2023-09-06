const {access} = require('fs').promises;

const {ApiError} = require('../errors');
const {fileConfig} = require('../configs');
const path = require('path');
const {imgDir} = require('../enums/path.enum');


module.exports = {
	checkImg: (req, res, next) => {
		try {
			if (!req.files) {
				return next(new ApiError('No images to upload', 400));
			}

			const imagesToUpload = Object.values(req.files);

			for (const image of imagesToUpload) {
				const {size, mimetype, originalname} = image;
				const {IMAGE_MAX_SIZE, IMAGE_MIMETYPES} = fileConfig;

				if (size > IMAGE_MAX_SIZE) {
					return next(new ApiError(`Image ${originalname} is too big. Max size: ${IMAGE_MAX_SIZE / 1024 / 1024}mb`, 400));
				}
				if (!IMAGE_MIMETYPES.includes(mimetype)) {
					return next(new ApiError(`Image ${originalname} has invalid format`, 400));
				}
			}

			next();
		} catch (e) {
			next(e);
		}
	},
	isBodyValid: async (req, res, next) => {
		try {
			const body = req.body;

			if (!Array.isArray(body)) {
				return next(new ApiError('Body must be an array', 400));
			} else if (!body.length) {
				return next(new ApiError('No path to images', 400));
			}
			for (const name of body) {
				const imgPath = path.join(imgDir, name);
				try {
					await access(imgPath);
				} catch (e) {
					return next(new ApiError(`File or directory ${imgPath} not found`, 404));
				}
			}

			next();
		} catch (e) {
			next(e);
		}
	},
};
