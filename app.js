global.id = '000123'
global.pageName = 'TopName'
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var rfs = require('rotating-file-stream')
var client = require('scp2')

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// var CronJob = require('cron').CronJob;
// new CronJob('* * * * * *', function() {
//     // upload file to server
//     client.scp('log.json', {
//         host: '',
//         username: 'mac',
//         password: '',
//         path: '~'
//     }, function(err) {
//         console.log(err)
//     })
//     console.log('You will see this message every second for upload');
// }, null, true, '');

// var CronJob = require('cron').CronJob;
// new CronJob('* * * * * *', function() {
//     // download file from server
//     client.scp({
//         host: 'example.com',
//         username: 'admin',
//         password: 'password',
//         path: '/home/admin/file.txt'
//     }, './', function(err) {})
//     console.log('You will see this message every second for download');
// }, null, true, '');

var logDirectory = path.join(__dirname, 'log')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStreamDaily = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
})
// setup the logger for daily
app.use(logger('combined', { stream: accessLogStreamDaily }))

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/log/access.log', { flags: 'a' })
// setup the logger for all
app.use(logger('combined', { stream: accessLogStream }))


// set tokens for custom id
logger.token('id', function(req) {
    return '00000001'
})

logger.token('pageName', function(req) {
    return 'Top'
})

// set log format: [dateTime id pageName]
logger.format('customLog', ':date :id :pageName');

app.use(logger('customLog', { stream: accessLogStream }))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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