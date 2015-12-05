
var express = require('express');
var router = express.Router();
var sendGrid = require('../libs/sendGrid/sendMail');
var path = require('path');


/* GET users listing. */
router.post('/', function(req, res) {
    if(req.body.from != '' || req.body.content != ''){
        sendGrid.sendNotificationMail(req.body,function(result){
            console.log('maild sent response is ',result);
            res.send(result);
        })
    }
});

router.get('/downloadResume',function(req,res){
    res.sendFile(path.join(__dirname, '../libs', 'pdf-sample.pdf'));
})

module.exports = router;
