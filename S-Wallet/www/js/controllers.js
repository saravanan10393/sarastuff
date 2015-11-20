angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope) {
    $('#percent').on('change', function () {
        var val = parseInt($(this).val());
        var $circle = $('#svg #bar');

        if (isNaN(val)) {
            val = 100;
        } else {
            var r = $circle.attr('r');
            var c = Math.PI * (r * 2);

            if (val < 0) {
                val = 0;
            }
            if (val > 100) {
                val = 100;
            }

            var pct = ((100 - val) / 100) * c;

            $circle.css({
                strokeDashoffset: pct
            });

            $('#cont').attr('data-pct', "500 of 5000");
        }
    });
})

.controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});