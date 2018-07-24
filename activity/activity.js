'use strict';

angular.module('myApp.activity', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/activity', {
    templateUrl: 'activity/activity.html',
    controller: 'activityCtrl'
  });
}])

.controller('activityCtrl', [ '$scope', 'activitySvc', 'roleService','settingsSvc', function($scope,  activitySvc, roleService,settingsSvc) {
    /*
    *   Calling the REST API for PAM 7 ( http://localhost:8080/kie-server/docs/ )
    *   HTTP POST request
    *   /server/containers/{containerID}/cases/{caseID}/instances
    *   Starts new case instance of given case definition within given container with optional
    *   initial CaseFile (that provides variables and case role assignment)
    */
    var baseURL = 'http://localhost:8080/kie-server/services/rest/server/containers/';
    var containerID = 'credit-dispute-case_1.0.0';
    var caseID = 'CreditCardDisputeCase.ChargeDispute';
    var endURL = '/instances';
    var pamUID = 'pamAdmin';
    var pamPWD = 'redhatpam1!';

    $scope.dt = null;
    $scope.opened = false;

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
    $scope.activity = activitySvc.getActivity();
    $scope.fraud = false;
    $scope.invalid = false;
    $scope.case_type = '';

    $scope.renderStatus = function (item){
        var imgSrc = '';
        switch (item.Status){
            case "Cleared" : imgSrc = "imgs/checkmark.png" ; break;
            case "Processing" : imgSrc = "imgs/inprogess.png" ; break;
            case "Flagged" : imgSrc = "imgs/flagged.png" ; break;
            default : imgSrc = "imgs/inprogress.png";
        }
        return imgSrc;
    }



    // This code manages the selection and highlighting for the table of transactions
    $scope.selectedRow = -1;
    $scope.setSelectedRow = function (index) {
        $scope.selectedRow = index;
    };

    // Called when the user clicks the dispute button
    $scope.disputeCharge = function (){
        if ($scope.selectedRow < 0) {
            alert("Please select a transaction");
        } else {
            console.log ($scope.activity[$scope.selectedRow].Description);
            $scope.isCollapsed = !$scope.isCollapsed
        }
    }

    // Send the dipute data (see ROLE) up to the server via the PAM REST API
    $scope.submitDispute = function (){

        if ($scope.dispute_type === ''){
            alert ('You must select a reason from the choices below');
            return;
        }


        var bpmResponse = "";

        // reset the panel
        $scope.fraud = false;
        $scope.invalid = false;
        $scope.isCollapsed = true;

        // GET THE CURRENT ROLE AND ASSIGN THE SELECTED VALUE FROM THE TABLE
        var userData = roleService.getCurrentRole();

        userData['case-data'].totalFraudAmount = $scope.activity[$scope.selectedRow].Debit;
        userData['case-data'].caseType = $scope.case_type;
        console.log (JSON.stringify(userData, null, 2));

        // CALL THE KIE-SERVER AND POST THESE VALUES
        //var url = 'http://localhost:8080/kie-server/services/rest/server/containers/credit-dispute-case_1.0.0/casesCreditCardDisputeCase.FraudDispute/instances
        var settings = settingsSvc.getCurrentSettings();
        var url = settings.baseURL + settings.containerID + '/cases/' + settings.caseID + '/instances'
        var xml = new XMLHttpRequest();
        xml.open('POST', url, true, settings.pamUID, settings.pamPWD);
        xml.withCredentials = true;
        xml.setRequestHeader ('x-kie-contenttype', 'json')
        xml.setRequestHeader ('Content-Type', 'application/json;charset=UTF-8')

        // Call the PAM service
        xml.onreadystatechange = function() {
            if (xml.readyState != 4)  { return; }
                if (xml.status != 201)  {
                    alert("error");
                    return;
                }
                console.log (this.responseText);
                bpmResponse = this.responseText
                alert ('Your dispute resolution number is: ' + bpmResponse + '\nPlease check your email for any updates.')
                $scope.activity[$scope.selectedRow].Status = 'Flagged';
                $scope.activity[$scope.selectedRow].CaseNumber = bpmResponse;
                $scope.activity[$scope.selectedRow].DisputeType = $scope.dispute_type
                $scope.activity = activitySvc.getActivity();
            };
        xml.send(JSON.stringify(userData));

    }
}]);
