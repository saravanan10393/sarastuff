var app = angular.module('sarastuff',[]);
app.config(["$httpProvider",
    function($httpProvider){
        $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    }
]);
app.controller('mainCtrl',['$scope','$http',function($scope,$http){
   $scope.user = {};
    $scope.mailSendScuess = false;
   $scope.sendNotificationMail = function(){
       $http({
           "content-Type":"application/json",
           method:"POST",
           data:$scope.user,
           url:"http://localhost:3000/mail"
       }).then(function(success){
           $scope.mailSendScuess = true;
           setTimeout(function(){
               console.log(success)
               $scope.$apply(function(){$scope.mailSendScuess = false;})
               
           },2000);
           
       },function(err){console.log('error in sending mail ',err)})
   }
}])