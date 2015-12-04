var sendGrid = require('sendgrid')('sarastuff', 'sara10393');
var email = new sendGrid.Email();
var templates = require('../mailTemplates/notification.js');

module.exports = {
    sendNotificationMail: function (data, callback) {
        email.addTo('saravanan.10393@gmail.com');
        email.subject = "Notification from sarastuff.com";
        email.from = 'noreply@sarastuff.com';
        templates.notificationEmailTemplate.replace('&lt;%fromEmail%&gt;',data.from);
        templates.notificationEmailTemplate.replace('&lt;%body%&gt;',data.content);
        email.html =  templates.notificationEmailTemplate;
//        email.setFilters({
//            'templates': {
//                'settings': {
//                    'enable': 1,
//                    'template_id': '7588bcb8-2ea2-4a8c-9c99-fcc214df8c2f',
//                }
//            }
//        });

        sendGrid.send(email, function (err, success) {
            if (err)
                callback({
                    error: true,
                    error_code: err
                });
            else
                callback(success);
        });

    }
}
