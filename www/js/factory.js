angular.module('starter')
.factory('AuthenticationService', function($http, $state) {
  return {
    getTicket : function(){
    },
    setTicket: function(ticket){
    },
    //REST API call to authenticate a user's credentials
    login: function(user, pass){
      console.log(user, pass);
      $http({
      }).then(function successCallback(msg) {
        console.log(msg);
        //console.log(tick);
        $state.go('app.landingpage');
      }, function failCallback(msg, username) {
        var errormessage = angular.element(document.querySelector('.login-error'));
        errormessage.css('display','block');
        errormessage.html("Invalid credentials were entered.");
        var clear = angular.element(document.querySelectorAll('.clear-icon'));
        clear.css("background-image", "url('/img/icons/formfield_error.svg')");
      });
    }
  };
}).factory('NodeService', function($http, AuthenticationService) {
  function getUserInfo(userId, infoRequired, node) {

  }
  return {
    getNodeById: function(id, nodes){

    },
    getSubNodesById: function(id, nodes){

    },
    getFavoriteNodes: function(nodes){
    },
    addFavoriteNodes: function(id){

    },
    deleteFavoriteNodes: function(id){
    },
    deleteNode: function(id){
    },
    getRecentlyAccessed: function(nodes){
    },

  };
});
