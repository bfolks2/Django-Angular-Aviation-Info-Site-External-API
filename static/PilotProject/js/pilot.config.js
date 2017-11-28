//ADDRESSES CHANGE IN ANGULARJS1.6 BEHAVIOR SO # LOGIC WILL STILL WORK
pilotApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
