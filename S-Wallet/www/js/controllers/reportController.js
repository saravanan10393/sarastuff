angular.module('SWallet.controllers')
    .controller('ChatsCtrl', function ($scope, Storage, $filter, $ionicPopup, $cordovaToast) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.allExpences = Storage.allExpences;

        $scope.calculateDayTotal = function (expence) {
            expence.dayTotal = 0;
            _.each(expence.expences, function (c_exp) {
                expence.dayTotal += parseInt(c_exp.ammount || 0);
            })
            return expence;
        };

        $scope.remove = function (expDate, expId) {
            Storage.deleteExpence(expDate, expId);
        };

        $scope.update = function (expDate, exp) {
            var temp = _.clone(exp);
            $scope.exp = exp;
            var myPopup = $ionicPopup.show({
                template: '<input type="text" number-only="numberOnly" ng-model="exp.ammount">',
                title: 'Enter expence ammount',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        onTap: function (e) {
                            if (!$scope.exp.ammount) {
                                $cordovaToast.showShortCenter(CONSTANTS.WARN.EXP_AMT_CANT_EMPTY);
                                e.preventDefault();
                            }
                        }
                    },
                    {
                        text: '<b>update</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.exp.ammount) {
                                $cordovaToast.showShortCenter(CONSTANTS.WARN.EXP_AMT_CANT_EMPTY);
                                e.preventDefault();
                            } else {
                                return $scope.exp;
                            }
                        }
                      }]
            });
            myPopup.then(function (res) {
                if (!res)
                    $scope.exp.ammount = temp.ammount;
                else {
                    Storage.updateExpence(expDate, $scope.exp);
                }
            });
        }
    })