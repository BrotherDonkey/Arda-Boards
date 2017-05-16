(function(){var App = angular.module("ardaApp", []);


    App.controller('TopicsController', function($http, $scope, apiService){
        
        
        $scope.user = document.getElementById('profile-name').innerText;
       
       //getting authorImg src 
        let authorImgArr = document.getElementById('navitar').src.split("/im");
        let baseUrl = authorImgArr.shift();
        $scope.userImg = `/im${authorImgArr[0]}`;
       
        $scope.date = new Date();
        $scope.newTopic = {
            "date": $scope.date,
            "author": $scope.user,
            "authorImg": $scope.userImg
        };
        
        // console.log($scope.userImg);
        
        
        
        // FUNCTION FOR GET REQUESTS TO GET TOPICS
        apiService.getTopics(function(response){
                console.log(`${response.data.length} topics were gotten`);
                $scope.list = response.data;
        });
        
        
        
        
        // FUNC FOR POST ROUTE -- MAKE NEW TOPICS
        $scope.submitTopic = function(item) {
            if (item.text && item.title) {
                apiService.postTopic(function(){}, item);
                $scope.newTopic = {};
                
                //get Topics to update scope
                apiService.getTopics(function(response){
                    // console.log(`${response.data.length} topics were gotten here`);
                    // $scope.list = response.data;
                });
                
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

            item.author = $scope.user;
            item.authorImg = $scope.userImg;
            
            if (item.text && item.topicId) {
                console.log(item.topicId, item.author);
                apiService.postComment(function(){}, item, item.topicId);
                
                
                $scope.newTopic = {};
                
                } else {
                var error = new Error();
                error = "Form incomlete";
                console.error(error);
            }
            
            item = {};
            
            //reload the page after post -- could also attach $scope.getTopics to this somehow. NEED A NEW ONE
            window.location.reload();
            
            
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
        
        
    });//end app controller
    
    App.service('apiService', function($http){

        // GET topics from api
        this.getTopics = function(callback){
            $http.get('https://fdy-brotherdonkey.c9users.io/api-topics/')
            .then(callback, function(err){
                if (err) console.error("damn! get request problem"+ err);
            });
        };
        
        // GET all topics, see in controller filtering down to singular topic (SingleTopicController)
        this.getOneTopic = function(callback){
            $http.get('https://fdy-brotherdonkey.c9users.io/api-topics/') //can dynamically insert topics?
            .then(callback, function(err){
                if (err) console.error("damn! get request problem"+ err);
            });
        };
        
        //for adding new topics to the api
        this.postTopic = function(callback, data){
            console.log("made it to the postTopic");
            $http.post('https://fdy-brotherdonkey.c9users.io/api-topics/', data)
            .then(callback);
        };
        
        //for adding comments to topics
        this.postComment = function(callback, data, topicId){
            // console.log('post in a new comment', data);
            $http.post(`https://fdy-brotherdonkey.c9users.io/api-topics/${topicId}/comments/`, data)
            .then(callback);
        };
        
        this.deleteComment = function(callback){
            console.log("delete a comment");
        };

    });
    
    
    App.controller('SingleTopicController', function($http, $scope, apiService){
        //getting authorImg src 
        let authorImgArr = document.getElementById('navitar').src.split("/im"),
            baseUrl = authorImgArr.shift();
        
        // setting scope variables
        $scope.userImg = `/im${authorImgArr[0]}`;
        $scope.user = document.getElementById('profile-name').innerText;
        $scope.topicId = document.getElementById('topic-id').innerText;

        // Get topics, filter down to the specified ID, display on page.
        apiService.getOneTopic(function(response){
            var id =  $scope.topicId;
            
            $scope.list = response.data;
            $scope.pageTopic = response.data.filter(function(item){
                if (item._id === id) {
                    return item;
                }
            });
            
            $scope.pageTopic = $scope.pageTopic[0];

        });
        
        $scope.postComment = function(item){
            
            item.author = $scope.user;
            item.authorImg = $scope.userImg;
            item.topicId = $scope.topicId;
            
            if (item.text && item.topicId) {
                console.log(item.topicId, item.author);
                apiService.postComment(function(){
                    
                }, item, item.topicId);
                
                $scope.newTopic = {};
                
                } else {
                var error = new Error();
                error = "Form incomlete";
                console.error(error);
            }
            
            item = {};
            
            //reload the page after post -- could also attach $scope.getTopics to this somehow. NEED A NEW ONE
            window.location.reload();

        };
        
        
    });
        
        console.log("angular attached");

})(); //end closure