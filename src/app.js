const express = require('express');
const session = require('express-session');
const path = require('path');

const {mainRouter} = require('./routers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
	secret: 'YOUR_SECRET',
	resave: true,
	saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
