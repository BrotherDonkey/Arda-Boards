(function(){var App = angular.module("ardaApp", []);

    var mock = {
          "author": "Will",
          "text": "hello, world!"
        };
        
    App.controller('TopicsController', function($scope, apiService){

        apiService.getTopics(function(response){
                console.log(response.data);
                $scope.list = response.data;
        });
        
        //post topic
        $scope.postTopic = function(item){
            apiService.postTopic(item);
        };
        
        // post comment
        $scope.postComment = function(item){
            apiService.postComment(item);
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
        this.postTopic = function(callback){
            console.log('posted a new topic');
        }
        
        //for adding comments to topics
        this.postComment = function(callback){
            console.log('post in a new comment');
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

