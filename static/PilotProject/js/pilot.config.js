//ADDRESSES CHANGE IN ANGULARJS1.6 BEHAVIOR SO # LOGIC WILL STILL WORK
pilotApp.config(['$locationProvider', '$httpProvider', function($locationProvider, $httpProvider) {
  $locationProvider.hashPrefix('');
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);
