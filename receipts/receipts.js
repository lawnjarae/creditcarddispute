'use strict';

angular.module('myApp.receipts', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/receipts', {
    templateUrl: 'receipts/receipts.html',
    controller: 'receiptsCtrl'
  });
}])

.controller ('receiptsCtrl', ['$scope', 'activitySvc', 'roleService','fileReader',function ($scope, activitySvc, roleService, fileReader){
    console.log ('receiptsCtrl');

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

    // This code handles the dispute panel (expand and collapse)
    $scope.singleModel = null;
    $scope.isCollapsed = true;

    $scope.disputedItems = activitySvc.getDisputedItems();

    // This code manages the selection and highlighting for the table of transactions
    $scope.selectedRow = -1;
    $scope.setSelectedRow = function (index) {
        $scope.selectedRow = index;
    };    

    $scope.viewDetails = function (){
        if ($scope.selectedRow < 0) {
            alert("Please select a transaction");
        } else {
            console.log ($scope.disputedItems[$scope.selectedRow].Description);
            $scope.isCollapsed = !$scope.isCollapsed
        }
    }

    $scope.renderCaseType = function (item){
        if (item.CaseType === "fraud"){
            return "imgs/lock-icon.png"
        } else {
            return "imgs/money-icon.png"
        }
    }

    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                      });
    };
 
    $scope.$on("fileProgress", function(e, progress) {
        //$scope.progress = progress.loaded / progress.total;
    });

}])