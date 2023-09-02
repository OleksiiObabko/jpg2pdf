const path = require('path');

module.exports = {
	renderMainPage: async (req, res, next) => {
		try {
			res.sendFile(path.join(__dirname, '..', '/public/html/index.html'));
		} catch (e) {
			next(e);
		}
	},
};
