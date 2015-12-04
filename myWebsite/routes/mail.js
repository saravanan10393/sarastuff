
var express = require('express');
var router = express.Router();
var sendGrid = require('../libs/sendGrid/sendMail');


/* GET users listing. */
router.post('/', function(req, res) {
    if(req.body.from != '' || req.body.content != ''){
        sendGrid.sendNotificationMail(req.body,function(result){
            console.log('maild sent response is ',result);
            res.send(result);
        })
    }
});

module.exports = router;
