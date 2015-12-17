var app = angular.module("Symbiotic"); 

app.controller("DashBoardCtrl", ['$scope','$stateParams','$http','symbioticService', function ($scope, $stateParams, $http ,symbioticService) {
	
	$scope.mySymbiotic = symbioticService.getmySymbiotic();
	console.log('the symbiotics are', $scope.mySymbiotic);
	console.log("the currentUser : ", $scope.currentUser)
	$scope.initializeData = function() {
		$http
		.get("/users/"+ $scope.currentUser.userName + "/Symbiose/"+ $stateParams.name2)
		.then( function (response) {
			if (response.data =="Error") {
				alert(" An error occured while loading the data, refresh the page");
			} else {
				$scope.data = response.data;
				console.log("the data is :", $scope.data)
			}
		});
	var length = $scope.mySymbiotic.length;
	for (var i=0; i< length; i++) {
		if ($stateParams.name2 === $scope.mySymbiotic[i]._id) {
			var knowledgesheknows = $scope.mySymbiotic[i].knowledgeIKnow;
			console.log('the matche symbiotic is : ', $scope.mySymbiotic[i])
			$scope.theSymbiotic = $scope.mySymbiotic[i];
			break;
		}
	}

	length = knowledgesheknows.length;
	console.log("here is the knowledge the Symbiotic knows:", knowledgesheknows );
	length2= $scope.currentUser.knowledgeIWant.length;
	$scope.knowledges = [];
	for (var i=0; i< length; i++) {
		for(var j=0; j< length2; j++) {
			if (knowledgesheknows[i].name === $scope.currentUser.knowledgeIWant[j].name) {
				$scope.knowledges.push(knowledgesheknows[i].name)
				console.log("here is a knowledge shared:", $scope.knowledges);
			}
		}
	}

	console.log("here is a knowledge shared:", $scope.knowledges);

//mySymbiotic structure : 
/*[{
	username
	id
	pass
	email
	knowledgesheknows
	knowledgeshewants --i don't care about this
}]*/
/*so i loop through mysybiotic, if id == $stateparms.name2, i catch the knowledge he knows, and compare to currentUser.knowledgeiWant, if  i get an equal,
i'll put them in tabs*/
		// $http
		// .get('/users/')
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
