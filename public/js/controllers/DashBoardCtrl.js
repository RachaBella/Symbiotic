var app = angular.module("Symbiotic"); 

app.controller("DashBoardCtrl", ['$scope','$stateParams','$http','symbioticService', function ($scope, $stateParams, $http ,symbioticService) {
	//you should treat when the the first params is the current user, and when it's not -----------> TODO
	$scope.newPost = {}
	$scope.mySymbiotic = symbioticService.getmySymbiotic();
	console.log('the symbiotics are', $scope.mySymbiotic);
	console.log("the currentUser : ", $scope.currentUser)
	var length = $scope.mySymbiotic.length;
	var id;
	$scope.initializeData = function() {

		if( $stateParams.name1 === $scope.currentUser.userName) {

			for (var i=0; i< length; i++) {
				if ($stateParams.name2 === $scope.mySymbiotic[i]._id) {
					var knowledgesheknows = $scope.mySymbiotic[i].knowledgeIKnow;
					console.log('the matche symbiotic is : ', $scope.mySymbiotic[i])
					$scope.theSymbiotic = $scope.mySymbiotic[i];
					break;
				}
			}

			l = knowledgesheknows.length;
			console.log("here is the knowledge the Symbiotic knows:", knowledgesheknows );
			length2= $scope.currentUser.knowledgeIWant.length;
			$scope.knowledges = [];
			for (var i=0; i< l; i++) {
				for(var j=0; j< length2; j++) {
					if (knowledgesheknows[i].name === $scope.currentUser.knowledgeIWant[j].name) {
						$scope.knowledges.push({ name:knowledgesheknows[i].name, id: knowledgesheknows[i]._id})
						console.log("here is a knowledge shared:", $scope.knowledges);
					}
				}
			}
			$scope.knowledge0 = $scope.knowledges[0]
			$scope.knowledges.splice(0,1)

			console.log("here is a knowledge shared:", $scope.knowledges);

		}else {
			for( var i=0; i < length; i++) {
				if ($stateParams.name1 === $scope.mySymbiotic[i].userName) {
					console.log("BINGOOOOOOOOOOOOOOOOOOOOOOO", $scope.mySymbiotic[i]);
					id =  $scope.mySymbiotic[i]._id;
					var knowledgesHeWants = $scope.mySymbiotic[i].knowledgeIWant;
					$scope.theSymbiotic = $scope.mySymbiotic[i];
					break;
				}
			}
			$scope.Symbiotics = symbioticService.getSymbiotic(id);
			var l = knowledgesHeWants.length
			length2= $scope.currentUser.knowledgeIKnow.length;
			$scope.knowledges = [];
			for (var i=0; i< l; i++) {
				for (var j=0; j< length2; j++) {
					if (knowledgesHeWants[i].name === $scope.currentUser.knowledgeIKnow[j].name) {
						$scope.knowledges.push({name: knowledgesHeWants[i].name, id: knowledgesHeWants[i]._id})
						console.log("here is a knowledge shared:", $scope.knowledges);
					}
				}
			}
			$scope.knowledge0 = $scope.knowledges[0]
			$scope.knowledges.splice(0,1)

		}


		//***FOR GETTING THE POSTS :***/ 
	$http
	.get("/users/"+ $stateParams.name1 + "/Symbiose/"+ $stateParams.name2)
	.then( function (response) {
		if (response.data =="Error") {
			alert(" An error occured while loading the data, refresh the page");
		} else {
			$scope.data = response.data;
			console.log("the data is :", $scope.data)
		}
	});

	//adding a new post
	$scope.addPost = function(knowledge) {
		console.log(" the post contain : ", $scope.newPost);
		$scope.newPost.knowledge = knowledge
		if( $stateParams.name1 === $scope.currentUser.userName) {
			$http
			.post("/posts/"+ $scope.currentUser._id + "/" + $stateParams.name2, $scope.newPost)
			.then (function (response) {
				if (response.data === "Error") {
					alert("An error occured when posting, please try again");
				} else {
					console.log(response.data);
				}
			})
		} else {
			$http
			.post("/posts/"+ $scope.currentUser._id + "/"+ id, $scope.newPost)
			.then( function (response) {
				if (response.data ==="Error") {
					alert("An error occured when posting, please try again");
				} else {
					console.log(response.data)
				}
			})
		}
	}

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
