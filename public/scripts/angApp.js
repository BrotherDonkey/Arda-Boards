(function(){var App = angular.module("ardaApp", []);


        
    App.controller('TopicsController', function($http, $scope, apiService){
        
        $scope.user = document.getElementById('profile-name').innerText;
        $scope.date = new Date();
        $scope.newTopic = {
            "date": $scope.date,
            "author": $scope.user
        };
        
        // FUNCTION FOR GET REQUESTS TO GET TOPICS
        apiService.getTopics(function(response){
                // console.log(response.data);
                $scope.list = response.data;
                
        });
        
        
        // FUNC FOR POST ROUTE -- MAKE NEW TOPICS
        $scope.submitTopic = function(item) {
            if (item.text && item.title) {
                apiService.postTopic(function(){}, item);
                $scope.newTopic = {};
                
            } else {
                var error = new Error();
                var error = "Form incomlete";
                console.error(error);
            }
            item = {};
            
            //reload the page after post -- could also attach $scope.getTopics to this somehow.
            window.location.reload();
        };
        
         // post comment
        $scope.postComment = function(item){
            if (item.text && item.topicId) {
                console.log(item.topicId)
                apiService.postComment(function(){}, item, item.topicId);
                $scope.newTopic = {};
                
                } else {
                var error = new Error();
                var error = "Form incomlete";
                console.error(error);
            }
            
            item = {};
            
            //reload the page after post -- could also attach $scope.getTopics to this somehow. NEED A NEW ONE
            window.location.reload();
            
            // apiService.postComment(item);
            
            
        };
        
        //post topic --see submit topic
        $scope.postTopic = function(item){
            apiService.postTopic(item);
            
            
            // newComment .topicId .author .text
        };
        
        //delete comment
        $scope.deleteComment = function(item, $index){
            apiService.deleteComment(item);
            $scope.list.splice($index);
            
        };
        
        $scope.editComment = function(item, $index) {
            apiService.editComment(item);
        };
        
        
    })//end app controller
    .service('apiService', function($http){
        
        
        
        this.helloworld = function(){
            console.log("hello, world!");
        };
        
        this.getTopics = function(callback){
            $http.get('https://fdy-brotherdonkey.c9users.io/api-topics/') //can dynamically insert topics?
            .then(callback);
        }
        
        //for adding new topics to the api
        this.postTopic = function(callback, data){
            console.log("made it to the postTopic")
            $http.post('https://fdy-brotherdonkey.c9users.io/api-topics/', data)
            .then(callback);
            
        }
        
        //for adding comments to topics
        this.postComment = function(callback, data, topicId){
            console.log('post in a new comment');
            $http.post(`https://fdy-brotherdonkey.c9users.io/api-topics/${topicId}/comments/`, data)
            .then(callback);
        }
        
        this.deleteComment = function(callback){
            console.log("delete a comment")
        }
        
        //
        
        
    });
    
    
    App.directive("topicAndComments", function(){
       return {
         restrict: "E",
         templateUrl: 'views/topicAndComments.pug'
       };
    });
        
        
    // });//controller end
    
        
        
        console.log("angular attached");

})(); //end closure

