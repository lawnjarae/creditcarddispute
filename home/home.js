'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl'
  });
}])

.controller('homeCtrl', ['$scope', 'roleService', function( $scope, roleService) {
  console.log ('in home ctrl');
 
  $scope.details = {}
  $scope.selectedCard = {}

  var role = roleService.getCurrentRole();
  switch (role['case-data'].customerStatus) {
      case 'GOLD'     : $scope.selectedCard.cardType = 'goldCard'; break;
      case 'SILVER'   : $scope.selectedCard.cardType = 'silverCard'; break;
      case 'STANDARD' : $scope.selectedCard.cardType = 'standardCard'; break;
      default         : $scope.selectedCard.cardType = 'standardCard';
    }



  $scope.setRole = function (role){
    roleService.setCurrentRole (role);
    switch (role) {
      case 'GOLD'     : $scope.selectedCard.cardType = 'goldCard'; break;
      case 'SILVER'   : $scope.selectedCard.cardType = 'silverCard'; break;
      case 'STANDARD' : $scope.selectedCard.cardType = 'standardCard'; break;
      default         : $scope.selectedCard.cardType = 'standardCard';
    }
  }
}]);

