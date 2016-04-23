angular.module('starter')
.factory('AuthenticationService', function($http, $state) {
  var automationUrl = "http://10.2.47.30/otcs/livelink.exe";
  var tick = null;
  return {
    url: automationUrl,
    getTicket : function(){
      return tick;
    },
    setTicket: function(ticket){
      tick = ticket;
    },
    login: function(user, pass){
      console.log(user, pass);
      $http({
        method: 'POST',
        url: automationUrl + '/api/v1/auth',
        data: "username=" + user + "&password=" + pass,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function successCallback(msg) {
        console.log(msg);
        tick = msg.data.ticket;
        console.log(tick);
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
  return {
    getNodeById: function(id){
      $http({
        method: 'GET',
        url: AuthenticationService.url + '/api/v1/nodes/' + id,
        headers: {'otcsticket': AuthenticationService.getTicket()}
      }).then(function successCallback(msg) {
        console.log(msg);
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    getSubNodesById: function(id, nodes){
      //AuthenticationService.getTicket();
      $http({
        method: 'GET',
        url: AuthenticationService.url + '/api/v1/nodes/' + id + '/nodes',
        headers: {'otcsticket': AuthenticationService.getTicket()}
      }).then(function successCallback(msg) {
        console.log(msg);
        nodes.data = msg.data.data;
        return msg.data;
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    }
  };
});
