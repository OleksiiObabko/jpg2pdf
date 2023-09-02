const express = require('express');

const {mainRouter} = require('./routers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', mainRouter);

app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		message: err.message || 'Unknown error',
		status: err.status || 500,
	});
});

app.listen(5000, async () => {
	console.log(`Server is listening port: ${5000}`);
});
