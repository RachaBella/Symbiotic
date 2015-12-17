'use strict';

var app = angular.module("Symbiotic", ['ui.router', 'ngAnimate','md.chips.select','ui-notification']);

app.config( function ($stateProvider, $urlRouterProvider, $locationProvider) {
  console.log("helloo from app.js");

 $locationProvider.html5Mode({  
  enabled: true,
  requireBase: false
  });
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('index', {
      url: "/",
      // templateUrl:"templates/index2.html"
          templateUrl: '/templates/index2.html',
          controller:"MainCtrl"
      
    })

    .state('dashboard', {
      url:'/users/:name1/Symbiose/:name2',
  
          templateUrl: '/templates/dash.html',
          controller:"DashBoardCtrl"
    
    })
     

    .state('profile', {
      url:"/users/:name",
      // templateUrl:"templates/profile.html",
      // controller:"ProfileCtrl"
     
          templateUrl: '/templates/profile.html',
          controller:"ProfileCtrl"
   
    });

    

      // $routeProvider.when('/settings', {
      //   templatesUrl: 'templates/settings', 
      //   controller: "ProfileCtrl"
      // });

    });

app.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}])

app.factory('socket', ['$rootScope', function ($rootScope) {
    var socket = io.connect();
    console.log("socket created");
 
    return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }
 
            socket.on(eventName, wrapper);
 
            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },
 
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}]);