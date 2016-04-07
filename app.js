//MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

//CUSTOM SERVICES
weatherApp.service('cityService', function(){
	this.city = "Minneapolis, MN";
	this.counter = 0;

});

//CUSTOM DIRECTIVES
weatherApp.directive("searchResult", function(){
	return	{
		templateUrl: 'directive-templates/search-result.html', 
		replace: true,
		scope: {
			weatherObject: "=",
			cityName: "@",
			getFahrenheit: "&",
			getDate: "&",
			
		}
		
	}

});

//CONTROLLERS
weatherApp.controller("splashController",["$scope", 'cityService', function($scope,  cityService ){
	
	$scope.city = cityService.city;		
	
	$scope.$watch('city', function(){
		
		cityService.city = $scope.city;		
	});
}]);

weatherApp.controller("forecastController",["$scope",  "$resource", "$routeParams",'cityService', function($scope, $resource, $routeParams, cityService){
		$scope.city= cityService.city ;

		$scope.days = $routeParams.days || '3';
		console.log($routeParams);
	$scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {APPID: "5cc89946ef30092ff3ab8260d97925df",callback: "JSON_CALLBACK"}, {get:{method:"JSONP"}});	

	$scope.weatherResult = $scope.weatherAPI.get({q: $scope.city, cnt:$scope.days});
	
	$scope.kelvin2Fahrenheit = function(kelvin){
		return Math.round((1.8*(kelvin - 273)) + 32);
	}

	$scope.getDate= function(time){
		return new Date(time*1000);
	}



}]);

//ROUTING CONFIGURATION
weatherApp.config(function($routeProvider){
	$routeProvider
	.when("/", {
		templateUrl: "pages/splash.html",
		controller: "splashController"
	})
	.when("/forecast", {
		templateUrl: "pages/forecast.html",
		controller: "forecastController"
	})
	.when("/forecast/:days", {
		templateUrl: "pages/forecast.html",
		controller: "forecastController"
	})
});