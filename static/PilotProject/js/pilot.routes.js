// ROUTES

pilotApp.config(function ($routeProvider) {

    $routeProvider

    .when('/', {
        templateUrl: '/static/PilotProject/js/pages/home.html',
        controller: 'homeController'
    })

    // .when('/airportDetails', {
    //     templateUrl: '/static/PilotProject/js/pages/airport_details.html',
    //     controller: 'airportController'
    // })

    .when('/airportDetails/:icao', {
        templateUrl: '/static/PilotProject/js/pages/airport_details.html',
        controller: 'airportController'
    })

});
