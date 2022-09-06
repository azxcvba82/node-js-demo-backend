
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

var indexRouter = require('./routes/auth.route');
var usersRouter = require('./routes/users.route');

const { ValidationError } = require('express-validation')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const corsWhiteLists ={
  origin: ["http://localhost:3000/","http://localhost:80/","https://node-js-demo-api.azxcvba99.net/"]
}

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", corsWhiteLists.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;
