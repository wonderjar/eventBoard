var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var wechat = require('wechat');

var routes = require('./routes');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.query());

var config = require('./config/config.json');
var env = process.env.NODE_ENV || "development";

var wechatConfig = {
  token: config[env].wechat.token,
  appid: config[env].wechat.appID,
  encodingAESKey: 'encodinAESKey'
};

app.use(express.query());
app.use('/wechat', wechat(config[env].wechat.token, function (req, res, next) {
  var message = req.weixin;
  console.log(message);
  if((message.MsgType === 'event') && (message.Event === 'subscribe'))
  {
    var replyStr = '感谢你的关注'
      + '\n'
      + '快为TA送出你的生日祝福吧'
      + '\n'
      + '点击下方Bless来选择近期过生日的小伙伴吧';
    res.reply(replyStr);
  }
  console.log(message.FromUserName);
  next()
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
