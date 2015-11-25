angular.module('SWallet.controllers')
    .controller('AccountCtrl', function ($scope, $filter, Storage) {
        $scope.settings = {
            enableFriends: true,
            expMonths: [],
            viewExp: $filter('date')(new Date(), 'MM/yyyy'),
            deleteExp: $filter('date')(new Date(), 'MM/yyyy'),
            downloadExp: $filter('date')(new Date(), 'MM/yyyy')
        };

        var i = 0,
            oJson = {},
            sKey;
        for (; sKey = window.localStorage.key(i); i++) {
            $scope.settings.expMonths.push({
                month: sKey,
                budject: window.localStorage.getItem(sKey)
            })
        }


    });
