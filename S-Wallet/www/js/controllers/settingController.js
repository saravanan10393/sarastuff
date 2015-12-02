angular.module('SWallet.controllers')
    .controller('AccountCtrl', function ($scope, $filter, Storage, $state, $cordovaToast, CONSTANTS, $ionicPopup) {
        $scope.settings = {
            enableFriends: true,
            expMonths: [],
            viewExp: $filter('date')(new Date(), 'MM/yyyy'),
            deleteExp: $filter('date')(new Date(), 'MM/yyyy'),
            downloadExp: $filter('date')(new Date(), 'MM/yyyy')
        };

        var i = 0,
            sKey;
        for (; sKey = window.localStorage.key(i); i++) {
            if (sKey.indexOf('/') != -1)
                $scope.settings.expMonths.push({
                    month: sKey,
                    budject: window.localStorage.getItem(sKey)
                })
        }

        $scope.updateBudject = function () {
            $scope.bjt = {
                budjectAmt: Storage.ammount.budjectAmt
            };
            var myPopup = $ionicPopup.show({
                template: '<label class="item item-input"><i class="fa fa-inr placeholder-icon"></i><input type="text" numbers-only="numbersOnly" ng-model="bjt.budjectAmt" placeholder="Budject ammount" maxlength="6"> </label>',
                title: 'Update ' + $filter('date')(new Date(), "MMMM") + ' budject ammount',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        onTap: function (e) {
                            if (!$scope.bjt.budjectAmt) {
                                $cordovaToast.showShortCenter(CONSTANTS.WARN.BJT_AMT_CANT_EMPTY);
                                e.preventDefault();
                            }
                        }
                    },
                    {
                        text: '<b>Update</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.bjt.budjectAmt) {
                                $cordovaToast.showShortCenter(CONSTANTS.WARN.BJT_AMT_CANT_EMPTY);
                                e.preventDefault();
                            } else {
                                return $scope.bjt.budjectAmt;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if (!res) return '';
                else {
                    if (parseInt(res) < Storage.ammount.spentAmt)
                        $cordovaToast.showShortCenter(CONSTANTS.WARN.BJT_AMT_CANT_LESS_THAN_SPENT_AMT);
                    else {
                        localStorage.setItem($filter('date')(new Date(), 'MM/yyyy'), res);
                        Storage.ammount.budjectAmt = parseInt(res);
                        $cordovaToast.showShortCenter(CONSTANTS.SUCCESS.BJT_UPDATED);
                    }

                }
            });
        }

        $scope.viewOtherExp = function (data) {
            var temp = data.split('/');
            if (Storage.currentViewMonth == data) {
                $cordovaToast.showShortCenter(CONSTANTS.WARN.NO_PRE_MONTH_DATA);
                return;
            }
            Storage.getAllExpences(temp[0], temp[1]).then(function () {
                if (data == $filter('date')(new Date(), 'MM/yyyy'))
                    Storage.readOnlyMode = false;
                else
                    Storage.readOnlyMode = true;
                Storage.currentViewMonth = data;
                $state.go('tab.chats');
            });
        }

        $scope.downloadExpPdf = function () {

        }

        $scope.deleteMonthlyExp = function (data) {
            var temp = data.split('/');
            if (temp[0] == new Date().getMonth() + 1) {
                $cordovaToast.showShortCenter(CONSTANTS.WARN.NO_PRE_MONTH_DATA_DELETE);
                return;
            }
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Expence',
                template: 'Are you sure you want to delete all expences of this month?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    Storage.deleteMonthlyExpence(temp[0], temp[1]).then(function () {
                        $cordovaToast.showShortCenter(CONSTANTS.SUCCESS.MON_EXP_DELETED_SUCCESSFULLY);
                    });
                } else {
                    console.log('You are not sure');
                }
            });
        }

        $scope.$on('$ionicView.enter', function (e) {
            $scope.settings.viewExp = Storage.currentViewMonth;
        });

    });
