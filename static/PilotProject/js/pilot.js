// MODULE
var pilotApp = angular.module('pilotApp', ['ngRoute', 'ngResource']);

pilotApp.factory('airportList', function ($http, $resource){

    this.airport = ''

    this.getDjangoData = function(){

      this.req1 = {
        method: 'GET',
        url: '/airports/api/?format=json',
      }

      return $http(this.req1)
    }


    this.getExternalData = function(icao){

      this.req2 = {
        method: 'GET',
        url: 'https://api.flightplandatabase.com/nav/airport/' + icao.toUpperCase(),
        headers: {
        },
      }

      return $http(this.req2)
    }


    return this;

});

pilotApp.controller('homeController', ['$scope', '$location', 'airportList', function($scope, $location, airportList) {

  $scope.search_input = airportList.airport;

  $scope.$watch('search_input',function(){
    airportList.airport = $scope.search_input;
  });

  airportList.getDjangoData().then(function(response){
    $scope.airports = response.data;
    console.log($scope.airports);
  });

  $scope.submit = function(){
    var urltext = "/airportDetails/" + airportList.airport
    $location.path(urltext);
  };

}]);


pilotApp.controller('airportController', ['$scope', '$routeParams', 'airportList', function($scope, $routeParams, airportList) {


  $scope.icao = $routeParams.icao;

  if($scope.icao.length > 4 || $scope.icao.length < 3){
    $scope.message = 'nope'
  }
  else{
    airportList.getExternalData($scope.icao).then(function successCallback(response) {

      //Labels to pass for cloaking purposes
      $scope.nameLabel = "Airport Name: "
      $scope.elevationLabel = "Elevation: "
      $scope.ftLabel = " ft"
      $scope.runwaysLabel = "Number of Runways: "
      $scope.countryLabel = "Country: "
      $scope.METARLabel = "Current METAR: "

      $scope.external = response.data;
      console.log($scope.external);
    }, function errorCallback(response) {
      $scope.message = "Error, no airport exists in the database for " + $scope.icao.toUpperCase()
      console.log(response.status);
    });
  }


}]);
