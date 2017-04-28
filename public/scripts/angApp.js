(function(){var App = angular.module("ardaApp", []);


        
    App.controller('TopicsController', function($scope, apiService){
        
        
        $scope.user = document.getElementById('profile-name').innerText;
        $scope.date = new Date();
        $scope.newTopic = {
            "date": $scope.date,
            "author": $scope.user
        };

        
        $scope.submitTopic = function(item) {
            if (item.text && item.title) {
                console.dir(item);
                console.dir("submitted:" + item);
            //   $scope.list.push(this.text);
            //   $scope.text = '';
            
                $scope.newTopic = {};
                
            } else {
                var error = new Error();
                var error = "Form incomlete";
                console.error(error);
            }
            
            item = {};
        };
        
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

