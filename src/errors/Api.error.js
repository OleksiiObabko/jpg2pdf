class ApiError extends Error {
	constructor(massage, status) {
		super(massage);
		this.status = status;
	}
}

module.exports = ApiError;
