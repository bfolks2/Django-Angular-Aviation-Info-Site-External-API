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
    // console.log($scope.airports);
  });

  $scope.submit = function(){
    var urltext = "/airportDetails/" + airportList.airport.toUpperCase()
    $location.path(urltext);
  };

}]);


pilotApp.controller('airportController', ['$scope', '$routeParams', '$http', 'airportList',
function($scope, $routeParams, $http, airportList) {

  $scope.icao = $routeParams.icao.toUpperCase();

  //Check to see if the ICAO is in the correct format
  if($scope.icao.length > 4 || $scope.icao.length < 3){
    $scope.message = 'Must enter a valid 3-4 letter ICAO Airport Code'
  }
  else{
    airportList.getExternalData($scope.icao).then(function successCallback(response) {

      $scope.external = response.data;
      // console.log($scope.external);

      airportList.getDjangoData().then(function(response){
        $scope.airports = response.data;
        $scope.empty = true;

        // console.log($scope.airports);

        //Check to see if the airport requested exists in the Django Database
        for (var i = 0; i < $scope.airports.length; i++) {
          if ($scope.airports[i]['icao'] == $scope.icao) {
            $scope.airport_dict = $scope.airports[i]
            $scope.empty = false;
          }
        }

        //If the airport is newly logged, create a copy in the Django Database
        if ($scope.empty){

          $scope.airport_dict = {
            'name': $scope.external.name,
            'icao': $scope.icao,
            'likes' : 0
          }

          $http.post('/airports/api/?format=json', $scope.airport_dict)
        }

        console.log($scope.airport_dict);

      });


      //Labels to pass for cloaking purposes
      $scope.header = $scope.icao + " Details:"

      $scope.name = $scope.external.name
      $scope.elevation = $scope.external.elevation + " ft"
      $scope.runways = $scope.external.runwayCount
      $scope.country = $scope.external.region
      $scope.METAR = $scope.external.weather.METAR

    }, function errorCallback(response) {
      $scope.message = "Error, unable to load data for " + $scope.icao.toUpperCase()
      console.log(response.status);
    });
  }


}]);
