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
  });

  $scope.submit = function(){
    var urltext = "/airportDetails/" + airportList.airport.toUpperCase()
    $location.path(urltext);
  };

}]);


pilotApp.controller('airportController', ['$scope', '$routeParams', '$http', 'airportList',
function($scope, $routeParams, $http, airportList) {

  $scope.icao = $routeParams.icao.toUpperCase();
  $scope.is_liked = false;

  //Check to see if the ICAO is in the correct format
  if($scope.icao.length > 4 || $scope.icao.length < 3){
    $scope.message = 'Must enter a valid 3-4 letter ICAO Airport Code'
  }
  else{
    airportList.getExternalData($scope.icao).then(function successCallback(response) {

      $scope.external = response.data;
      console.log($scope.external);

      airportList.getDjangoData().then(function(response){
        $scope.airports = response.data;
        $scope.empty = true;


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

      });

      $scope.addLike = function(){
          if($scope.is_liked == false){
            $scope.airport_dict.likes = $scope.airport_dict.likes + 1
            $http.patch('/airports/api/?format=json', {'likes':$scope.airport_dict.likes, 'icao':$scope.icao})
            $scope.is_liked = true;
          }
      }


      $scope.runwayList = function(){
        rlist=$scope.external.runways
        half = rlist.length/2
        output=[]

        for (var i = 0; i < half; i++) {
          if(rlist[i]['ident'].includes("L")){
            rname = rlist[i]['ident'] + "/" + rlist[i+half+1]['ident']
          }
          else if(rlist[i]['ident'].includes("R")){
            rname = rlist[i]['ident'] + "/" + rlist[i+half-1]['ident']
          }
          else{
            rname = rlist[i]['ident'] + "/" + rlist[i+half]['ident']
          }

          dims = ' --- Width: ' + Math.round(parseInt(rlist[i]['width'])) + ' ft' +
          ', Length: ' + Math.round(parseInt(rlist[i]['length'])) + ' ft' +
          ', Surface: ' + rlist[i]['surface']

          output.push(rname + dims)
        }
        return output
      }


      $scope.frequencyList = function(){
        fdict = {};
        flist = $scope.external.frequencies;

        for (freq of flist) {
          //Lower and round the frequency received from external API
          fnum = (parseInt(freq['frequency'])/1000000).toFixed(2)
          if (freq['name'] in fdict){
            fdict[freq['name']].push(fnum.toString())
          }
          else{
            fdict[freq['name']] = [fnum.toString()]
          }
        };
        return fdict
      };


      $scope.getWeather =function(){
        if ($scope.external.weather.METAR == null){
          return 'No weather station at this airport'
        }
        else{
          return $scope.external.weather.METAR
        }
      }


      $scope.getDatetime = function(){
        date=new Date()
        return ((date.valueOf() + date.getTimezoneOffset() * 60000) + (parseInt($scope.external.timezone.offset)*1000))
      };

      //Labels to pass for cloaking purposes
      $scope.header = $scope.icao + " Details:"

      $scope.name = $scope.external.name
      $scope.elevation = $scope.external.elevation + " ft MSL"
      $scope.runwayCount = $scope.external.runwayCount
      $scope.country = $scope.external.region
      $scope.runways = $scope.runwayList();
      $scope.frequencies = $scope.frequencyList();


    }, function errorCallback(response) {
      $scope.message = "Error, unable to load data for " + $scope.icao.toUpperCase()
      console.log(response.status);
    });
  }


}]);
