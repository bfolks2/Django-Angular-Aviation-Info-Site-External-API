alert('working2')

// MODULE
var pilotApp = angular.module('pilotApp', ['ngRoute', 'ngResource']);

pilotApp.factory('airportList', function ($http, $resource){

    this.airport = 'KORD'

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

pilotApp.controller('homeController', ['$scope', 'airportList', function($scope, airportList) {

  $scope.search_input=''

  airportList.getDjangoData().then(function(response){
    $scope.airports = response.data;
    console.log($scope.airports);
  });

  airportList.getExternalData('KPWK').then(function(response){
    $scope.external = response.data;
    console.log($scope.external);
  });

}]);


pilotApp.controller('airportController', ['$scope', '$routeParams', 'airportList', function($scope, $routeParams, airportList) {

  $scope.icao = $routeParams.icao;

  if($scope.icao.length !== 4){
    $scope.message = 'nope'
  }
  else{
    $scope.message = 'yep'
  }

}]);
