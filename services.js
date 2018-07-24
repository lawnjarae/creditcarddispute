angular.module('myApp.services', [])

/*
*   Calling the REST API for PAM 7 ( http://localhost:8080/kie-server/docs/ )
*   HTTP POST request
*   /server/containers/{containerID}/cases/{caseID}/instances
*   Starts new case instance of given case definition within given container with optional
*   initial CaseFile (that provides variables and case role assignment)
*/
.service ('settingsSvc', function(){

    // THESE DEFAULT VALUES ARE JUST IN CASE SOMEONE WHACKS THE WRONG STUFF
    const baseURL = 'http://localhost:8080/kie-server/services/rest/server/containers/';
    const containerID = 'credit-dispute-case_1.0.0';
    const caseID = 'CreditCardDisputeCase.ChargeDispute';
    const pamUID = 'pamAdmin';
    const pamPWD = 'redhatpam1!';

    var currentSettings = {
        baseURL     : baseURL,
        containerID : containerID,
        caseID      : caseID,
        pamUID      : pamUID,
        pamPWD      : pamPWD
      }

    var getCurrentSettings = function (){
        return currentSettings;
    }

    var setCurrentSettings = function (settings){
        currentSettings = settings;
    }

    var resetSettings = function (){
        currentSettings.baseURL = baseURL;
        currentSettings.containerID = containerID;
        currentSettings.caseID = caseID;
        currentSettings.pamUID = pamUID;
        currentSettings.pamPWD = pamPWD;
        return currentSettings;
    }

    return {
        getCurrentSettings : getCurrentSettings,
        setCurrentSettings : setCurrentSettings,
        resetSettings : resetSettings
    }
})

.service ('roleService', function(){
    // THIS ARE THE STATUS TYPES
    var GOLD = {
        "case-data" : {
            "totalFraudAmount" : 100, //this gets swapped at runtime
            "customerStatus" : "GOLD",
            "customerAge" : 41,
            "incidentCount" : 1
        },
        "case-user-assignments" : {
            "owner" : "pamAdmin",
            "dispute-manager" : ""
        },
        "case-group-assignments" : {
            "dispute-manager" : "manager"
        }
    };

    var SILVER = {
        "case-data" : {
            "totalFraudAmount" : 200,
            "customerStatus" : "SILVER",
            "customerAge" : 24,
            "incidentCount" : 1
        },
        "case-user-assignments" : {
            "owner" : "pamAdmin",
            "dispute-manager" : ""
        },
        "case-group-assignments" : {
            "dispute-manager" : "manager"
        }
    };

    var STANDARD = {
        "case-data" : {
            "totalFraudAmount" : 300,
            "customerStatus" : "STANDARD",
            "customerAge" : 16,
            "incidentCount" : 1
        },
        "case-user-assignments" : {
            "owner" : "pamAdmin",
            "dispute-manager" : ""
        },
        "case-group-assignments" : {
            "dispute-manager" : "manager"
        }
    };

    var _currentRole = STANDARD;

    var setCurrentRole = function (role){
        switch (role){
            case 'GOLD'     : _currentRole = GOLD; break;
            case 'SILVER'   : _currentRole = SILVER; break;
            case 'STANDARD' : _currentRole = STANDARD; break;
            default         : _currentRole = STANDARD;
        }
        console.log ('current role set to: ' + _currentRole['case-data'].customerStatus);
    }

    var getCurrentRoleType = function (){
        var rtype = _currentRole['case-data'].customerStatus;
        console.log ('returning role type: ' + rtype);
        return rtype;
    }

    var getCurrentRole = function(){
        console.log ('returning role object: ' + JSON.stringify(_currentRole, null, 2));
        return _currentRole;
    }

    return {
        getCurrentRole : getCurrentRole,
        setCurrentRole : setCurrentRole
    }
})

.service ('activitySvc', function (){
    activity = [
        {
            "id" : 0,
            "Status": "Flagged",
            "Date": "06/11/2018",
            "Description": "CALI PIZZA KITC INC #1 PLANO         TX",
            "Debit": 42.7,
            "Credit": "",
            "CaseNumber" : "FR-0000000019",
            "CaseType" : "dispute"
        },
        {
            "id" : 50,
            "Status": "Cleared",
            "Date": "06/11/2018",
            "Description": "AUTO PAYMENT | ACCT ENDING XXXX-3003 | THANK YOU",
            "Debit": "",
            "Credit": 1504.98
        },
        {
            "id" : 1,
            "Status": "Cleared",
            "Date": "06/11/2018",
            "Description": "INT*IN *XTREME SWIM, I PLANO         TX",
            "Debit": 58.17,
            "Credit": ""
        },
        {
            "id" : 2,
            "Status": "Flagged",
            "Date": "06/12/2018",
            "Description": "KROGER #0540           PLANO         TX",
            "Debit": 45.32,
            "Credit": "",
            "CaseNumber" : "FR-0000000018",
            "CaseType" : "fraud"
        },
        {
            "id" : 3,
            "Status": "Cleared",
            "Date": "06/12/2018",
            "Description": "PLANO UTILITY SVCS INT 972-9417000   TX",
            "Debit": 113.9,
            "Credit": ""
        },
        {
            "id" : 4,
            "Status": "Pending",
            "Date": "06/13/2018",
            "Description": "TAVERNA ROSSA          PLANO         TX",
            "Debit": 36.26,
            "Credit": ""
        },
        {
            "id" : 5,
            "Status": "Cleared",
            "Date": "06/15/2018",
            "Description": "WHOLEFDS PLN 10030     PLANO         TX",
            "Debit": 35.67,
            "Credit": ""
        },
        {
            "id" : 6,
            "Status": "Cleared",
            "Date": "06/16/2018",
            "Description": "GLORIAS RESTAURANT #5  FRISCO        TX",
            "Debit": 31.96,
            "Credit": ""
        },
        {
            "id" : 7,
            "Status": "Cleared",
            "Date": "06/16/2018",
            "Description": "LINEAR AUTOMOTIVE      PLANO         TX",
            "Debit": 2090.25,
            "Credit": ""
        },
        {
            "id" : 8,
            "Status": "Cleared",
            "Date": "06/16/2018",
            "Description": "TOM THUMB #2595        PLANO         TX",
            "Debit": 45.02,
            "Credit": ""
        },
        {
            "id" : 9,
            "Status": "Pending",
            "Date": "06/17/2018",
            "Description": "APL* ITUNES.COM/BILL   866-712-7753  CA",
            "Debit": 10.81,
            "Credit": ""
        },
        {
            "id" : 10,
            "Status": "Cleared",
            "Date": "06/17/2018",
            "Description": "TOM THUMB #2595        PLANO         TX",
            "Debit": 33.09,
            "Credit": ""
        },
        {
            "id" : 11,
            "Status": "Cleared",
            "Date": "06/17/2018",
            "Description": "SAUCYS THAI & PHO      PLANO         TX",
            "Debit": 41.42,
            "Credit": ""
        },
        {
            "id" : 12,
            "Status": "Pending",
            "Date": "06/18/2018",
            "Description": "DOUGH PIZZERIA         PLANO         TX",
            "Debit": 40.4,
            "Credit": ""
        },
        {
            "id" : 13,
            "Status": "Cleared",
            "Date": "06/18/2018",
            "Description": "KROGER #0540           PLANO         TX",
            "Debit": 73.02,
            "Credit": ""
        },
        {
            "id" : 14,
            "Status": "Cleared",
            "Date": "06/18/2018",
            "Description": "ACADEMY SPORTS #79     PLANO         TX",
            "Debit": 97.4,
            "Credit": ""
        }
        ];

    var getActivity = function (){
        return activity;
    }

    var disputedItems = [];
    var getDisputedItems = function (){
        disputedItems = activity.filter (item =>{
            if (item.Status === 'Flagged'){
                return item.Status === 'Flagged';
            }
        });
        return disputedItems;
    }

    return {
        getActivity : getActivity,
        getDisputedItems : getDisputedItems
    }
})
.service ('fileReader', function ($q, $log){
    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function(reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
                {
                    total: event.total,
                    loaded: event.loaded
                });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
})
