
var app = angular.module("Symbiotic");

app.controller('ProfileCtrl',['$http', '$scope', 'socket','symbioticService', function ($http, $scope, socket, symbioticService) {
	var iWant = [];
	var iKnow = [];
	$scope.iWant =[];
	$scope.iKnow =[];
  $scope.counter = 0;
  $scope.invitations = [];
  $scope.mySymbiotic= [];
  
  //Getting the current user symbiotic :
	$http
  .get("/users/"+$scope.currentUser._id+"/mySymbiotic")
  .then( function (response) {
    if (response.data==="Error") {
      alert("An error occured while loading your symbiotics; try later");
    } else {
      $scope.mySymbiotic = response.data;
      symbioticService.setmySymbiotic($scope.mySymbiotic);
      console.log("the symbioticService set to :" , symbioticService.getmySymbiotic() )
      console.log("lets see the structure :", $scope.mySymbiotic);
       //I have to devise  : who currentUser is mentoring, who is mentOrEd by ?
      $scope.mentee = symbioticService.getMyMentees($scope.currentUser, $scope.mySymbiotic);
      $scope.mentor =  symbioticService.getMyMentors($scope.currentUser,$scope.mySymbiotic);
    }                      
  });

	$scope.updatePreferences = function () {
		var KnowledgesId = {
			iKnow: $scope.iKnow,
			iWant: $scope.iWant
		}
		console.log("the scopes  =", KnowledgesId);

    /**uodating the user's knowledges*/
		$http
		.put("/knowledges", KnowledgesId)
		.then( function (response) {
			if (response.data == 'Error'){
				alert("An error occured while updating your preference, please try again");
			}
			else if (response.data !=="Error") {
				alert("Success updating your data")
				console.log(response.data);
				$scope.currentUser = response.data
        $scope.iKnow={};
        $scope.iWant={};
			}
		});
	};

	$scope.updateInfo = function () {
		if ($scope.user.email === $scope.currentUser.email) {
			$scope.user.email="";
		}
		if ($scope.user.username === $scope.currentUser.userName) {
			$scope.user.username ="";
		}
		$http
		.put("/users/"+ $scope.currentUser._id, $scope.user)
		.then( function (response) {
			if (response.data == 'Error'){
				alert("An error occured while updating your personnal information, please try again");
			}
			else if (response.data ==="Email exists") {
				alert("The email exists already, try agayn");
			} else if (response.data ==="Username exists") {
				alert("The username you have chosen exists already, try again");
			} else if (response.data ==='No Update') {
				alert("No changes have been made");
			} else {
				$scope.currentUser = response.data;
				alert("Updated");
			}
		});
	}

  $scope.deleteIWant = function(knowing) {
    $http
    .delete("/users/"+ $scope.currentUser._id + "/knowledgeIWant/"+ knowing._id)
    .then (function (response) {
      if (response.data ==="Error") {

      }else {
        $scope.currentUser.knowledgeIWant = response.data
      }
    })

  }

  $scope.deleteIKnow = function(knowing) {

     $http
    .delete("/users/"+ $scope.currentUser._id + "/knowledgeIKnow/"+ knowing._id)
    .then (function (response) {
      if (response.data ==="Error") {

      }else {
        $scope.currentUser.knowledgeIKnow = response.data
      }
    })

  }

  $scope.getSymbiotics = function () {
    	$http
    	.get("/users/"+ $scope.currentUser._id+ "/MatchingSymbiotics")
    	.then( function (response) {
    		if(response.data.length ===0) {
    			alert("Sorry , you have no match");
    		}
    		else {
    			console.log("Your possible matched symbiotics are : ", response.data);
    			//$scope.doubledSymbiotics = response.data;
          // var result= [];
          // for (var i=0; i< $scope.doubledSymbiotics.length; i++ ) {
          //   var found = false
          //   for(j=0; j< result.length; j++) {
          //     if ( $scope.doubledSymbiotics[i].userName === result[j].userName) {
          //       found= true
          //     }
          //   }
          //   if (found!== true) {
          //     result.push(  $scope.doubledSymbiotics[i]);
          //   }
          // }
          $scope.Symbiotics = response.data;
          //console.log("your symbiotics : those people ", response.data[0].usersWhoKnow, "know :", response.data[0].name)
    		}

    	});
  };

  $scope.connect = function (user, currentUser) {
    	socket.emit("invitationRequest", {userI: user, current: currentUser});
    	console.log("You have sent an invitation to", user.userName);
  }

  $scope.accept = function (user, currentUser) {
    	socket.emit("invitationResponse", {msg:"accept", user: user, current: currentUser});
      var i = $scope.invitations.indexOf(user);
      $scope.invitations.splice(i,1);
      $scope.counter = $scope.counter - 1;
      console.log("the counter is", $scope.counter)
  
  }

    $scope.refuse = function (user) {
    	socket.emit("invitationResponse", {msg:"refuse", data: user});
      var i = $scope.invitations.indexOf(user);
      $scope.invitations.splice(i,1);
      $scope.counter = $scope.counter - 1;
      console.log("the counter is", $scope.counter)
    }

    socket.on("invitationResponse", function(data) {
    	if (data.msg=="refuse"){
    		console.log(data.user.userName + "has refused your invitation");
        Materialize.toast('Your invitation request to '+ data.userName +' has been refused ', 5000);
    	}
      else {
        if (data.msg=="Error"){
        Materialize.toast('An error occured when adding '+ data.user.userName +' , Invite him again', 5000);
      } else if (data.msg== "SuccessAdding"){
        console.log("on successAdding state !!!!!!!!", data);
        Materialize.toast(data.data.userName +' has been added successfully to the list of your symbiotics', 5000);
         console.log("lets see the structure of the data sent: at SuccessAdding", data.data)
        $scope.mySymbiotic.push(data.data);
        symbioticService.setmySymbiotic($scope.mySymbiotic);
        $scope.mentee = symbioticService.getMyMentees($scope.currentUser, $scope.mySymbiotic);
        $scope.mentor =  symbioticService.getMyMentors($scope.currentUser,$scope.mySymbiotic);
      } else if (data.msg=="Success") {
        Materialize.toast(data.data.userName +' has accepted your invitation request', 5000);
        console.log("lets see the structure of the data sent: at Success", data.data)
        $scope.mySymbiotic.push(data.data);
        symbioticService.setmySymbiotic($scope.mySymbiotic);
        $scope.mentee = symbioticService.getMyMentees($scope.currentUser, $scope.mySymbiotic);
        $scope.mentor =  symbioticService.getMyMentors($scope.currentUser,$scope.mySymbiotic);
      }

      } 
      // Materialize.toast('You have an invitation request from '+ data.userName , 10000);
    	// $scope.primaryTitle = function() {
     //        Notification({message: data.msg, title: 'New message'});
     //    };
    })

    socket.on("invitationRequest", function(data) {
    	  Materialize.toast('You have an invitation request', 5000);
        
        for (var i =0; i< data.length; i++) {
           $scope.invitations.push(data[i].current);
           $scope.counter++;

        }
        $http
        .delete("/sockets/"+ $scope.currentUser._id)
        .then(function (response) {
          if (response.data) {
            console.log("DELETED", response.data);
          }
        })
        console.log('the data from the invitation request is ', data.current)
        console.log('an invitation request  recieved!!');
    })
   

    // $scope.primaryTitle = function(data) {
    //         Notification({message: data.msg, title: 'New message'});
    // };

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
