angular.module('SWallet', ['ionic', 'SWallet.controllers', 'SWallet.directives', 'SWallet.factories', 'SWallet.filters', 'ngCordova'])

.run(function ($ionicPlatform, $cordovaSQLite, Storage, $cordovaVibration) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        Storage.db = $cordovaSQLite.openDB("SWallet");
        $cordovaSQLite.execute(Storage.db, "CREATE TABLE IF NOT EXISTS expences (id integer primary key, date text, availAmt text, expences text)");
        console.log("created db connection ", Storage.db);
        if (Storage.db) {
            Storage.getAllExpences();
        }

        //local notification
        cordova.plugins.notification.local.hasPermission(function (granted) {
            console.log('local permission enabled ', granted);
            if (!granted) {
                cordova.plugins.notification.local.registerPermission(function (granted) {
                    console.log('local permission request ', granted);
                    if (granted) {

                    }
                });
            }
            var options = {
                id: 1,
                title: 'Forgot to enter today expences?',
                text: '',
                sound: 'file://note.m4r',
                every: 'daily',
                autoClear: false,
                at: new Date(new Date().getTime() + 10 * 1000)
            }
            cordova.plugins.notification.local.schedule(options);
            $cordovaVibration.vibrate(200);
        });

    });
}).constant("CONSTANTS", {
    WARN: {
        EXP_AMT_EXCEED_REMAIN_AMT: "Expence can't exceed remaining amount",
        BJT_AMT_CANT_EMPTY: "Budject ammount can't empty",
        EXP_AMT_CANT_EMPTY: "Expence ammount can't empty",
        NO_PRE_MONTH_DATA: "No more old expence to view",
        BJT_AMT_CANT_LESS_THAN_SPENT_AMT: "Budject amount can't less than spent amount"
    },
    ERROR: {
        FAILED_TO_ADD_EXPENCE: "Failed to add expence",
    },
    SUCCESS: {
        EXP_ADDED: "Expence added successfully",
        BJT_UPDATED: "Budject updated successfully",
        MON_EXP_DELETED_SUCCESSFULLY: "Expence is deleted successfully"
    }
});

angular.module('SWallet.controllers', []);

angular.module('SWallet.directives', []);

angular.module('SWallet.factories', []);

angular.module('SWallet.filters', []);
