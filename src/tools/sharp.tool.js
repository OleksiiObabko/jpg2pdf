const sharp = require('sharp');

module.exports = {
	rotateImage: async (img, deg) => {
		const imgName = Date.now() + '.' + img.mimetype.split('/')[1];

		await sharp(img.buffer)
			.rotate(deg)
			.toFile(`src/public/images/${imgName}`);
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
