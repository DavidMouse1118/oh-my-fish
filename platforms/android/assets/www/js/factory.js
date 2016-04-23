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
    //REST API call to authenticate a user's credentials
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
  function getUserInfo(userId, infoRequired, node) {
    $http({
      method: 'GET',
      url: AuthenticationService.url + '/api/v1/members/' + userId,
      headers: {'otcsticket': AuthenticationService.getTicket()}
    }).then(function successCallback(msg) {
      info = msg.data.data[infoRequired];
      node.owner_name = info;
    }, function failCallback(msg, username) {
      console.log(msg);
    });
  }
  return {
    //REST API call to retrive a node via its ID
    getNodeById: function(id, nodes){
      $http({
        method: 'GET',
        url: AuthenticationService.url + '/api/v1/nodes/' + id,
        headers: {'otcsticket': AuthenticationService.getTicket()},
      }).then(function successCallback(msg) {
        console.log(msg);
        console.log(msg.data.data.name);
        nodes.currentFolder[nodes.currentIndex] = msg.data.data.name;
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    //REST API call to retrieve all the subnodes of a node whose ID you know
    getSubNodesById: function(id, nodes){
      //AuthenticationService.getTicket();
      $http({
        method: 'GET',
        url: AuthenticationService.url + '/api/v1/nodes/' + id + '/nodes',
        headers: {'otcsticket': AuthenticationService.getTicket()}
      }).then(function successCallback(msg) {
        console.log(msg);
        nodes.data[nodes.currentIndex] = msg.data.data;
        console.log( msg.data.data);
        return msg.data;
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    //REST API call to retrieve all favourite nodes
    getFavoriteNodes: function(nodes){
      //AuthenticationService.getTicket();
      $http({
        method: 'GET',
        url: AuthenticationService.url + '/api/v2/members/favorites',
        headers: {'otcsticket': AuthenticationService.getTicket()}
      }).then(function successCallback(msg) {
        console.log(msg);
        nodes.data[nodes.currentIndex] = msg.data.results;
        console.log(nodes.data[nodes.currentIndex]);
        console.log(nodes.data[nodes.currentIndex][0].data.properties);
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    //REST API call to add a node as a favourite
    addFavoriteNodes: function(id){
      //AuthenticationService.getTicket();
      $http({
        method: 'POST',
        url: AuthenticationService.url + '/api/v2/members/favorites/' + id,
        data: '',
        headers: {'otcsticket': AuthenticationService.getTicket(), 'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function successCallback(msg) {
        console.log(msg);
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    //REST API call to remove a node from favourites
    deleteFavoriteNodes: function(id){
      //AuthenticationService.getTicket();
      $http({
        method: 'DELETE',
        url: AuthenticationService.url + '/api/v2/members/favorites/' + id,
        headers: {'otcsticket': AuthenticationService.getTicket()}
      }).then(function successCallback(msg) {
        console.log(msg);
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    //REST API call to delete a node
    deleteNode: function(id){
      //AuthenticationService.getTicket();
      $http({
        method: 'DELETE',
        url: AuthenticationService.url + '/api/v1/nodes/' + id ,
        headers: {'otcsticket': AuthenticationService.getTicket()}
      }).then(function successCallback(msg) {
        console.log(msg);
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    //REST API call to retrieve all recently accessed nodes
    getRecentlyAccessed: function(nodes){
      $http({
        method: 'GET',
        url: AuthenticationService.url + '/api/v2/members/accessed',
        headers: {'otcsticket': AuthenticationService.getTicket()},
      }).then(function successCallback(msg) {
        nodes.data = msg.data.results;
        return msg.data.results;
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    //REST API call to search for a node in the main workspace
    searchCall: function(input) {
       $http({
        method: 'GET',
        url: AuthenticationService.url + '/api/v1/nodes/2000/nodes?where_name=' + input,
        headers: {'otcsticket': AuthenticationService.getTicket()},
      }).then(function successCallback(msg) {
        console.log(input);
        console.log(msg);
        //nodes.data = msg.data.results;
        //return msg.data.results;
      }, function failCallback(msg, username) {
        console.log(msg);
      });
    },
    //Method to get the owner info of a recently accessed node in order to display it on the page
    parseNodeRecentlyAccessed: function(node){
      getUserInfo(node.owner_user_id, "name", node);
    },
    //Method to display the appropriate icon for each node which is loaded on the page based on its mime_type
    parseNode: function (node){
      console.log(node);
      //SET ICON
      if (node.mime_type != null) {
        if (node.mime_type.indexOf("excel") > -1) {
          node.icon = "img/mime/mime_excel.svg"
        } else if (node.mime_type.indexOf("word") > -1) {
          node.icon = "img/mime/mime_word.svg";
        } else if (node.mime_type.indexOf("pdf") > -1) {
          node.icon = "img/mime/mime_pdf.svg"
        } else if (node.mime_type.indexOf("jpeg") > -1) {
          node.icon = "img/mime/mime_jpeg.svg"
        } else if (node.mime_type.indexOf("plain") > -1) {
          node.icon = "img/mime/mime_paper.svg"
        } else if (node.mime_type.indexOf("powerpoint") > -1) {
          node.icon = "img/mime/mime_powerpoint.svg"
        } else if (node.mime_type.indexOf("powerpoint") > -1) {
          node.icon = "img/mime/mime_powerpoint.svg"
        } else if (node.mime_type.indexOf("gif") > -1) {
          node.icon = "img/mime/mime_image.svg"
        }else if (node.mime_type.indexOf("png") > -1) {
          node.icon = "img/mime/mime_image.svg"
        }else if (node.mime_type.indexOf("html") > -1) {
          node.icon = "img/mime/mime_html.svg"
        }else {
          node.icon = "img/mime/mime_document.svg"
        }
      } else if (node.type_name.indexOf("Folder") > -1) {
        node.icon = "img/mime/mime_folder.svg";
      } else if (node.type_name.indexOf("URL") > -1) {
        node.icon = "img/mime/mime_html.svg";
      } else if (node.type_name.indexOf("Category") > -1) {
        node.icon = "img/mime/mime_category.svg";
      } else {
        node.icon = "img/mime/mime_document.svg"
      }

    },

    parseFavoriteNode: function (node){
      console.log(node);
      //SET ICON
      if (node.data.properties.mime_type != null) {
        if (node.data.properties.mime_type.indexOf("excel") > -1) {
          node.icon = "img/mime/mime_excel.svg"
        } else if (node.data.properties.mime_type.indexOf("word") > -1) {
          node.icon = "img/mime/mime_word.svg";
        } else if (node.data.properties.mime_type.indexOf("pdf") > -1) {
          node.icon = "img/mime/mime_pdf.svg"
        } else if (node.data.properties.mime_type.indexOf("jpeg") > -1) {
          node.icon = "img/mime/mime_jpeg.svg"
        } else if (node.data.properties.mime_type.indexOf("plain") > -1) {
          node.icon = "img/mime/mime_paper.svg"
        } else if (node.data.properties.mime_type.indexOf("powerpoint") > -1) {
          node.icon = "img/mime/mime_powerpoint.svg"
        } else if (node.data.properties.mime_type.indexOf("powerpoint") > -1) {
          node.icon = "img/mime/mime_powerpoint.svg"
        } else {
          node.icon = "img/mime/mime_document.svg"
        }
      } else if (node.data.properties.type_name.indexOf("Folder") > -1) {
        node.icon = "img/mime/mime_folder.svg";
      } else if (node.data.properties.type_name.indexOf("URL") > -1) {
        node.icon = "img/mime/mime_html.svg";
      } else if (node.data.properties.type_name.indexOf("Category") > -1) {
        node.icon = "img/mime/mime_category.svg";
      } else {
        node.icon = "img/mime/mime_document.svg"
      }

    }
  };
});
