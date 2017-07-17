var express = require('express');
var router = express.Router();
var fs = require('fs');
var client = require('scp2')


router.use(function(req, res, next) {
    // console.log('Time:', Date.now())
    // console.log(req.query.login_name)
    // console.log(global.pageName);
    // console.log(global.id);
    var result = JSON.parse(fs.readFileSync('log.json'));
    console.log(result.mapPageName);
    console.log(result.mapDetailPageName);
    console.log(req.body)

    // upload file to server
    client.scp('log.json', {
        host: '',
        username: 'mac',
        password: '',
        path: '~'
    }, function(err) {
        console.log(err)
    })

    // download file from server
    client.scp({
        host: 'example.com',
        username: 'admin',
        password: 'password',
        path: '/home/admin/file.txt'
    }, './', function(err) {})

    next()
})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/map.html', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
module.exports = router;