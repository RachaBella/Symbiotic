
var app = angular.module("Symbiotic");

app.controller('MainCtrl', ['$scope','$http','symbioticService', function ($scope,  $http, symbioticService) {
	$scope.newUser = {};
	//$scope.counter = symbioticService.counter();

	$scope.signUp = function() {
		console.log("helloooo");
		console.log("new user", $scope.newUser)
		if(( $scope.newUser.password !=="") &&($scope.newUser.pass === $scope.newUser.password)) {
			$http
				.post('/users', $scope.newUser)
				.then(function(response){
					if(response.data =="Error") {
						alert("This email or username is already taken, Try again");
						$scope.newUser={}
					} else if (response.data ==="Username exists") {
						alert("This username is already taken, try a new one")
					} else if (response.data ==="Email exists") {
						alert("This email already exists, try again")
					} else {
						console.log('the response is', response.data);
					    $scope.currentUser = response.data;
						Materialize.toast('Welcome '+ $scope.currentUser.userName  +' to Symbiotic.', 5000);
					    $scope.getKnowledgeIKnow();
						$scope.getKnowledgeIWant();
					        // self.all = response.data.criminals;
					}
				    
				});
		}
		else {
			alert("Passwords not match , try again");
		}
	}

	$scope.login = function() {
		$http
		.post('/login', $scope.user)
		.then( function (response) {
			console.log(response.data);
			if (response.data =="wrong email") {
				alert("This email doesn't exist, try again");
				$scope.user ={};
			}else if (response.data =="Error: incorrect password") {
				alert("You used a wrong password, try again");
				$scope.user ={};
			} else if ((response.data !== "Error: incorrect password") && (response.data !=="wrong email") && (response !== null )) {
				$scope.currentUser = response.data;
				Materialize.toast('Welcome Back '+ $scope.currentUser.userName + ' to Symbiotic.', 5000);
				$scope.getKnowledgeIKnow();
				$scope.getKnowledgeIWant();
			}
		});

	};

	$scope.logout = function() {
		$scope.currentUser = null;
		$http
		.get('/logout')
		.then(function (response) {
			$scope.currentUser = null;
			$scope.user = {};
			$scope.newUser= {};
			window.location="/";
		});

	}

	$scope.getCurrentUser = function () {
		$http
		.get('/currentUser')
		.then(function (response) {
			if (response.data) {
				$scope.currentUser = response.data.user;
				console.log(response.data.user);
				if (($scope.currentUser !== undefined)  && ($scope.currentUser !== null)) {
					$scope.getKnowledgeIKnow();
					$scope.getKnowledgeIWant();
				}

			}else {
				$scope.currentUser = null;
				console.log(response.data.user);
			}
		});
	}

		// $http
		// .get("/knowledges")
		// .then( function (response) {
		// 	console.log("the knowledges are : ", response.data);
		// 	$scope.knowledges= response.data;
		// });
	
	$scope.getKnowledgeIKnow = function () {
			$http
			.get("/users/"+ $scope.currentUser._id+ "/knowledgeIKnow")
			.then( function (response) {
				console.log("what i know",response.data);
				$scope.knowledgeIKnow= response.data
				return $scope.knowledgeIKnow;
			});
		}

	$scope.getKnowledgeIWant = function () {
			$http
			.get("/users/"+ $scope.currentUser._id+ "/knowledgeIWant")
			.then( function (response) {
				console.log("what i want",response.data);
				$scope.knowledgeIWant= response.data
				return $scope.knowledgeIWant;
			});
	}


}]);

app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) 
      {
        if (attr.type==='text/javascript-lazy') 
        {
          var s = document.createElement("script");
          s.type = "text/javascript";                
          var src = elem.attr('src');
          if(src!==undefined)
          {
              s.src = src;
          }
          else
          {
              var code = elem.text();
              s.text = code;
          }
          document.head.appendChild(s);
          elem.remove();
        }
      }
    };
  });

