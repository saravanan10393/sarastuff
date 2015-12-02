angular.module('SWallet.controllers')
    .controller('DashCtrl', ['$scope', '$filter', 'Storage', '$ionicPopup', '$cordovaToast', 'CONSTANTS', '$timeout', function ($scope, $filter, Storage, $ionicPopup, $cordovaToast, CONSTANTS, $timeout) {
        /*  setTimeout(function () {
      Storage.deleteAllExpence();
  }, 2000)*/
        $scope.ammount = Storage.ammount;
        $scope.readOnlyMode = Storage.readOnlyMode;
        $scope.expence = {};
        //update progress at firttime load;
        $timeout(function () {
            $scope.calculateDayExpenceTotal();
        }, 2000)
        var updateCircularBar = function () {
            var $circle = $('#svg #bar'),
                r = $circle.attr('r'),
                c = Math.PI * (r * 2),
                pct = ((100 - (($scope.ammount.remainingAmt / $scope.ammount.budjectAmt) * 100)) / 100) * c;

            $circle.css({
                strokeDashoffset: pct
            });
        }

        $scope.calculateDayExpenceTotal = function () {
            $scope.ammount.spentAmt = 0;
            if (Storage.allExpences.length == 0) {
                $scope.ammount.remainingAmt = $scope.ammount.budjectAmt;
            } else {
                _.each(Storage.allExpences, function (expence) {
                    expence.dayTotal = 0;
                    _.each(expence.expences, function (c_exp) {
                        expence.dayTotal += parseInt(c_exp.ammount || 0);
                    })
                    Storage.ammount.spentAmt += expence.dayTotal;
                })
                Storage.ammount.remainingAmt = Storage.ammount.budjectAmt - Storage.ammount.spentAmt;
            }
            console.log("calucluate method called ");
            updateCircularBar();
        }

        // update the progress at first time
        $scope.calculateDayExpenceTotal();

        $scope.addNewExpence = function (expence) {
            expence.ammount = parseInt(expence.ammount);
            $scope.ammount.remainingAmt = parseInt($scope.ammount.remainingAmt)
            if (expence.ammount > $scope.ammount.remainingAmt) {
                $cordovaToast.showShortCenter(CONSTANTS.WARN.EXP_AMT_EXCEED_REMAIN_AMT);
                return;
            }
            expence.id = Math.random();
            expence.date = $filter('date')(new Date(), 'dd/MM/yyyy');
            expence.time = $filter('date')(new Date(), 'h:mm a');
            Storage.addExpence(_.clone(expence)).then(function () {
                $cordovaToast.showShortCenter(CONSTANTS.SUCCESS.EXP_ADDED);
                Storage.ammount.spentAmt = parseInt(Storage.ammount.spentAmt) + expence.ammount;
                Storage.ammount.remainingAmt = parseInt(Storage.ammount.budjectAmt) - parseInt(Storage.ammount.spentAmt)
                updateCircularBar();
                $scope.expence = {};
            }, function () {
                $cordovaToast.showShortCenter(CONSTANTS.ERROR.FAILED_TO_ADD_EXPENCE);
            });
        }

        $scope.prombtSalary = function () {
            $scope.bjt = {
                budjectAmt: $scope.ammount.budjectAmt
            };
            var myPopup = $ionicPopup.show({
                template: '<label class="item item-input"><i class="fa fa-inr placeholder-icon"></i><input type="text" numbers-only="numbersOnly" ng-model="bjt.budjectAmt" placeholder="Budject ammount" maxlength="6"> </label>',
                title: 'Enter ' + $filter('date')(new Date(), "MMMM") + ' budject ammount',
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
                    localStorage.setItem($filter('date')(new Date(), 'MM/yyyy'), res);
                    Storage.ammount.budjectAmt = parseInt(res);
                    $scope.calculateDayExpenceTotal();
                }
            });
        }

        if (!Storage.ammount.budjectAmt) $scope.prombtSalary();

        $scope.$on('$ionicView.enter', function (e) {
            $scope.readOnlyMode = Storage.readOnlyMode;
            $scope.calculateDayExpenceTotal();
        });
}])
