var createError = require('http-errors');
var express = require('express');
const loginRouter = require('./routes/loginRouter');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const hospitalRouter = require('./routes/hospitalRouter');
const ventilatorRouter = require('./routes/ventilatorRouter');

const middleware = require('./middleware');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/hospitalManagement';
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true
});

connect.then(db => {
  console.log('Connected correctly to server');
}, err => { console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/', middleware.checkToken, indexRouter);
app.use('/hospitals', middleware.checkToken, hospitalRouter);
app.use('/ventilators', middleware.checkToken, ventilatorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
