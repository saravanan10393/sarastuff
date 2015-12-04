var notification ='<html><head><title></title><style type="text/css">body{background:#E0E0E0}.header{margin:auto;height:auto;width:90%;background:#039BE5;color:#fff;box-shadow: 0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12);}.header .title{text-align:center;font-size:20px;}.header .title span{font-weight:bold;color:#795548}.header .body{line-height: 30px;font-family: sans-serif;margin-left: 25px;}</style></head><body><div class="header"><p class="title">Notification from &nbsp;&nbsp;<span>&lt;%fromEmail%&gt;</span></p>&nbsp;<div class="body">&lt;%body%&gt;</div></div></body></html>';

module.exports = {
    notificationEmailTemplate:notification
}