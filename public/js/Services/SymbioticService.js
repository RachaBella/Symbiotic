
var app = angular.module('Symbiotic');

app.factory("symbioticService", ['$http', function ($http) {
	
	this.mySymbiotic= [];
	//Getting the current user symbiotic :
    return {
    	getmySymbiotic: function() {
    		return this.mySymbiotic;
    	},

    	setmySymbiotic: function(value) {
    		this.mySymbiotic = value;
    	} , 

    	getMyMentees: function(currentUser, mySymbiotic) {
    		var length = mySymbiotic.length;
    		var length2 = currentUser.knowledgeIKnow.length;
    		var mentee= [];
    		var found = false
    		for(var i=0; i< length; i++) {
    			console.log('symbiotic:  ', i, " is  ", mySymbiotic[i])
    			var length3 = mySymbiotic[i].knowledgeIWant.length;
    			for (var j =0; j< length3; j++) {
    				console.log('Symbiotic knowledge he wants, ', mySymbiotic[i].knowledgeIWant[j].name )
    				for(var k=0; k < length2; k++ ) {
    					if (mySymbiotic[i].knowledgeIWant[j].name == currentUser.knowledgeIKnow[k].name) {
    						mentee.push(mySymbiotic[i]);
    						console.log("the mentee is :", mentee)
    						found = true
    						break;
    					}
    					
    				}
    				if (found=== true) {
    						break;
    				}
    				
    			}
    			found = false;
    		}
			return mentee;
    	},

    	getMyMentors: function(currentUser, mySymbiotic) {
    		console.log("the Symbiotics are", mySymbiotic)
    		var length = mySymbiotic.length;
    		var length2 = currentUser.knowledgeIWant.length;
    		var mentor= [];
    		var found = false
    		for(var i=0; i< length; i++) {
    			console.log('symbiotic:  ', i, " ", mySymbiotic[i])
    			var length3 = mySymbiotic[i].knowledgeIKnow.length;
    			for (var j =0; j< length3; j++) {
    				console.log('Symbiotic knowledge he knows, ', mySymbiotic[i].knowledgeIKnow[j].name )
    				for(var k=0; k < length2; k++ ) {
    					if (mySymbiotic[i].knowledgeIKnow[j].name == currentUser.knowledgeIWant[k].name) {
    						mentor.push(mySymbiotic[i]);
    						found = true
    						break;
    					}
    					
    				}
    				if (found === true) {
    						break;
    				}
    				
    			}
    			found = false;
    		}
			return mentor;

    	},
    	//users/:id/mySymbiotic
    	getSymbiotic: function (userId) {
    		$http
    		.get("/users/"+ userId +"/mySymbiotic")
    		.then( function (response) {
    			return response.data;
    		})

    	}
    }
}]);