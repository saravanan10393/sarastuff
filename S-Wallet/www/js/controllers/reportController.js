angular.module('SWallet.controllers')
    .controller('ChatsCtrl', ['$scope', 'Storage', '$filter', '$ionicPopup', '$cordovaToast', '$ionicActionSheet', '$cordovaToast', 'CONSTANTS', function ($scope, Storage, $filter, $ionicPopup, $cordovaToast, $ionicActionSheet, $cordovaToast, CONSTANTS) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.allExpences = Storage.allExpences;
        $scope.readOnlyMode = Storage.readOnlyMode;

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

        $scope.editDayExpences = function (expenceDate) {

            var promptNewExpence = function () {
                $scope.expence = {};
                var myPopup = $ionicPopup.show({
                    title: 'New Expence',
                    subTitle: 'Enter Details',
                    templateUrl: 'templates/dialogs/newExpenceDialog.html',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.expence.ammount && !$scope.expence.title && !$scope.expence.note) {
                                    $cordovaToast.showShortCenter("Please Enter all details");
                                    e.preventDefault();
                                } else {
                                    if (parseInt($scope.expence.ammount) > parseInt(Storage.ammount.remainingAmt)) {
                                        $cordovaToast.showShortCenter(CONSTANTS.WARN.EXP_AMT_EXCEED_REMAIN_AMT);
                                        e.preventDefault();
                                    } else {
                                        return $scope.expence;
                                    }
                                }
                            }
                     }
                    ]
                });
                myPopup.then(function (expence) {
                    expence.ammount = parseInt(expence.ammount);
                    if (expence.ammount > parseInt(Storage.ammount.remainingAmt)) {
                        $cordovaToast.showShortCenter(CONSTANTS.WARN.EXP_AMT_EXCEED_REMAIN_AMT);
                        return;
                    }
                    expence.id = Math.random();
                    expence.date = expenceDate;
                    expence.time = $filter('date')(new Date(), 'h:mm a');
                    Storage.addExpence(_.clone(expence)).then(function () {
                        $cordovaToast.showShortCenter(CONSTANTS.SUCCESS.EXP_ADDED);
                        Storage.ammount.spentAmt += expence.ammount;
                        Storage.ammount.remainingAmt = Storage.ammount.budjectAmt - Storage.ammount.spentAmt;
                        //updateCircularBar();
                        $scope.expence = {};
                    }, function () {
                        $cordovaToast.showShortCenter(CONSTANTS.ERROR.FAILED_TO_ADD_EXPENCE);
                    });
                });
            }


            $ionicActionSheet.show({
                buttons: [
                    {
                        text: 'Add Expence'
                    },
                    ],
                destructiveText: 'Delete',
                titleText: 'Edit DayExpences',
                cancelText: 'Cancel',
                cancel: function () {
                    return true;
                },
                buttonClicked: function (index) {
                    promptNewExpence();
                },
                destructiveButtonClicked: function () {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Delete Expence',
                        template: 'Are you sure you want to delete all expences of the day?'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            Storage.deleteAllDayExpence(expenceDate);
                        } else {
                            console.log('You are not sure');
                        }
                    });
                }

            });
        }

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
    }])
