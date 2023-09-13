const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const {imgDir} = require('../enums/path.enum');

module.exports = {
	rotateImgAfterSave: async (imgName) => {
		try {
			const ext = path.extname(imgName);
			const imgPath = path.join(imgDir, imgName);
			const rotatedImgName = Date.now().toString() + ext;
			const rotatedImgPath = path.join(imgDir, rotatedImgName);

			await sharp(imgPath)
				.rotate(90)
				.toFile(rotatedImgPath);
			await fs.unlink(imgPath);

			return rotatedImgName;
		} catch (error) {
			console.error('Error rotating image:', error);
		}
	},
	rotateImgBeforeSave: async (img) => {
		const imgName = Date.now() + '.' + img.mimetype.split('/')[1];
		// create img dir in not exists
		try {
			await fs.access(imgDir);
		} catch (e) {
			await fs.mkdir(imgDir);
		}

		await sharp(img.buffer)
			.rotate()
			.toFile(path.join(imgDir, imgName));
	},
	getDimensions: async (imgPath, pageWidth, pageHeight) => {
		const imgInfo = await sharp(imgPath).metadata();

		const scaleX = pageWidth / imgInfo.width;
		const scaleY = pageHeight / imgInfo.height;
		const scale = Math.min(scaleX, scaleY);

		const width = imgInfo.width * scale;
		const height = imgInfo.height * scale;
		const x = (pageWidth - width) / 2;
		const y = (pageHeight - height) / 2;

		return {
			width,
			height,
			x,
			y,
		};
	},
};
