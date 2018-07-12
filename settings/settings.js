
'use strict';

angular.module('myApp.settings', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'settings/settings.html',
    controller: 'settingsCtrl'
  });
}])

.controller('settingsCtrl', [ '$scope', 'settingsSvc', 'roleService', function($scope, settingsSvc, roleService) {
    console.log ('in settings control');

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
    $scope.settings = settingsSvc.getCurrentSettings();
  
    $scope.saveSettings = function (){
      settingsSvc.saveSettings ($scope.settings);
    }

    $scope.resetForm = function () {
      console.log ('save clicked');
      $scope.settings = settingsSvc.resetSettings();
    }
}]);