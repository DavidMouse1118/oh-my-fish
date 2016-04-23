/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])
//Controller for the whole app.
// This is where you can define methods or actions that stay constant throughout the app
.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $ionicPopup, NodeService) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.isExpanded = false;
  $scope.hasHeaderFabLeft = false;
  $scope.hasHeaderFabRight = false;

  var navIcons = document.getElementsByClassName('ion-navicon');
  for (var i = 0; i < navIcons.length; i++) {
    navIcons.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  }

  ////////////////////////////////////////
  // Layout Methods
  ////////////////////////////////////////

  $scope.hideNavBar = function() {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
  };

  $scope.showNavBar = function() {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
  };

  $scope.noHeader = function() {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }
  };

  $scope.setExpanded = function(bool) {
    $scope.isExpanded = bool;
  };

  $scope.setHeaderFab = function(location) {
    var hasHeaderFabLeft = false;
    var hasHeaderFabRight = false;

    switch (location) {
      case 'left':
      hasHeaderFabLeft = true;
      break;
      case 'right':
      hasHeaderFabRight = true;
      break;
    }

    $scope.hasHeaderFabLeft = hasHeaderFabLeft;
    $scope.hasHeaderFabRight = hasHeaderFabRight;
  };

  $scope.hasHeader = function() {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (!content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }

  };

  $scope.hideHeader = function() {
    $scope.hideNavBar();
    $scope.noHeader();
  };

  $scope.showHeader = function() {
    $scope.showNavBar();
    $scope.hasHeader();
  };

  $scope.clearFabs = function() {
    var fabs = document.getElementsByClassName('button-fab');
    if (fabs.length && fabs.length > 1) {
      fabs[0].remove();
    }
  };

  //Add button method to let the user add a folder or upload a new document version
  //***IN PROGRESS***//
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Add Menu',
      template: 'Options: Add a Folder, Add Version'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };

  function delayExpansion(){
    $timeout(function() {
      ionicMaterialMotion.fadeSlideInRight();
      for (var index in $scope.nodes.data[$scope.nodes.currentIndex]) {
        NodeService.parseNode($scope.nodes.data[$scope.nodes.currentIndex][index]);
      }
    }, 2000);
  }
  $scope.loadRecentlyAccessed = function() {
    $scope.nodes = {data: null};
    NodeService.getRecentlyAccessed($scope.nodes);
    $timeout(function() {
      for (var index in $scope.nodes.data) {
        NodeService.parseNode($scope.nodes.data[index].data.properties);
        NodeService.parseNodeRecentlyAccessed($scope.nodes.data[index].data.properties);
      }
    }, 500);
  }
  //Search method
  $scope.searchList = function(input) {
    console.log(input);
    NodeService.searchCall(input);
  }

})

//Controller for the Enterprise Workspace page
//Here are defined the methods and actions specific to user behaviour allowed on the Enterprise Workspace page
.controller('EnterpriseCtrl', function($scope, $stateParams, $state, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicActionSheet, $ionicPopup, NodeService) {
  // Set Header
  console.log($stateParams);
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.$parent.setHeaderFab('left');
  $scope.nodes = {data: createArray(25, null), currentIndex: 0};
  $scope.nodes.currentFolder = [];

  //Reload the workspace page
  $scope.reloadingTheEnterprise = function(id){
    $timeout(function() {
      NodeService.getSubNodesById(id, $scope.nodes);
    }, 300);
    // Delay expansion
    $timeout(function() {
      ionicMaterialMotion.fadeSlideInRight();
      console.log("reloading the enterprisePage");
      for (var index in $scope.nodes.data[$scope.nodes.currentIndex]) {
        NodeService.parseNode($scope.nodes.data[$scope.nodes.currentIndex][index]);
      }
    }, 2000);
  };

  //Functionality for the <Delete> button after user presses it in the action menu of a node
  $scope.showDeleteConfirm = function(name, id, parentId) {
    console.log(parentId);
    var confirmPopup = $ionicPopup.confirm({
     title: 'Delete',
     template: 'Do you really want to delete ' + name + '?'
   });

    confirmPopup.then(function(res) {
     if(res) {
       NodeService.deleteNode(id);
       $scope.reloadingTheEnterprise(parentId);
     } else {
       console.log('cancel deleting');
     }
   });
 };
  // Triggered on a button click, or some other target
  // Action Menu for a node and its options
  $scope.show = function() {
    // Show the action sheet
    var that = this;
    var hideSheet = $ionicActionSheet.show({
      buttons: [
      { text: 'View' },
      { text: 'Add To Favourites' },
      { text: 'Download'}
      ],
      destructiveText: 'Delete',
      titleText: 'ACTIONS',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
        hideSheet();
      },

    //Functionality defined for clicking any of the 3 buttons: <View> , <Add to Favourites>, <Download>
    //***IN PROGRESS***//
    buttonClicked: function(index, button) {
        //If <View> is clicked
        if (index === 0) {
          $scope.nodes.currentIndex++;
          //IF FOLDER IS ALREADY STORED IN NODES, USE THAT INSTEAD OF NODE SERVICE
          console.log($scope.nodes.currentIndex);
          console.log(that.node.name);
          console.log($scope.nodes.data[$scope.nodes.currentIndex]);
          if ($scope.nodes.currentIndex > 1 && $scope.nodes.data[$scope.nodes.currentIndex] != null && that.node.name === $scope.nodes.data[$scope.nodes.currentIndex].name) {
            $timeout(function () {
              ionicMaterialMotion.fadeSlideInRight();
            }, 250);
          } else {
            $scope.nodes.currentFolder[$scope.nodes.currentIndex] = that.node.name;
            NodeService.getSubNodesById(that.node.id, $scope.nodes);
            //$scope.nodes.currentFolder[$scope.nodes.currentIndex] = that.node.name;
            delayExpansion();
          }
        }
        else if(index === 1){
          NodeService.addFavoriteNodes(that.node.id);
        }
        else if (index === 2){//////////////////////////////////////////////////////////Get Recently Accessed. This is wrong here and needs to become the
          ///////////////////////////////////////////////////////////////////////////// "Download Node" functionality when its implemented
          NodeService.getRecentlyAccessed();
        } else {
          NodeService.getSubNodesById(that.node.id, $scope.nodes);
          delayExpansion();
        }
        return true;
      },

    //Functionality defined for clicking <Delete> in the node's Action Menu
    destructiveButtonClicked: function() {
        //$scope.nodes.currentIndex++;
        that.showDeleteConfirm(that.node.name, that.node.id, that.node.parent_id);
        return true;
      }

    });
};

//Back Button functionality
$scope.goBack = function(){
  $scope.nodes.currentIndex--;
  $timeout(function () {
    ionicMaterialMotion.fadeSlideInRight();
  }, 250);
}

NodeService.getSubNodesById($stateParams.nodeId, $scope.nodes);
NodeService.getNodeById($stateParams.nodeId, $scope.nodes);
delayExpansion();

$timeout(function() {
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
}, 300);

function delayExpansion(){
  $timeout(function() {
    ionicMaterialMotion.fadeSlideInRight();
    for (var index in $scope.nodes.data[$scope.nodes.currentIndex]) {
        NodeService.parseNode($scope.nodes.data[$scope.nodes.currentIndex][index]);
      }
    }, 2000);
}


function createArray(len, itm) {
  var arr1 = [itm],
  arr2 = [];
  while (len > 0) {
    if (len & 1) arr2 = arr2.concat(arr1);
    arr1 = arr1.concat(arr1);
    len >>>= 1;
  }
  return arr2;
}
  // Set Ink
  ionicMaterialInk.displayEffect();
})

//Controller for the Login Page
//Includes authentication using the OTCS Ticket
.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, AuthenticationService) {
  $scope.$parent.clearFabs();

  $timeout(function() {
    $scope.$parent.hideHeader();
  }, 0);

  $scope.errorgone = function() {
    var errormessage = angular.element(document.querySelector('.login-error'));
    errormessage.css('display','none');
    var clearIcon = angular.element(document.querySelectorAll('.clear-icon'));
    clearIcon.css("background-image", "url('/img/icons/formfield_clear.svg')");
  }

  $scope.username = "";
  $scope.password= "";

  ionicMaterialInk.displayEffect();

  $scope.authenticate = AuthenticationService.login;
})

//Controller for the Landing Page
//Basic setup for what is shown on the page
.controller('LandingPageCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  // Set Header
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);
  $scope.name = "ADMIN";
  // Set Ink
  ionicMaterialMotion.blinds();
  ionicMaterialInk.displayEffect();

})

//Controller for the Recently Accessed Page
.controller('ActivityCtrl', function($scope, $stateParams, $timeout, $ionicActionSheet, NodeService, $ionicPopup, ionicMaterialMotion, ionicMaterialInk) {
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab('right');

  $timeout(function() {
    ionicMaterialMotion.fadeSlideIn({
      selector: '.animate-fade-slide-in .item'
    });
  }, 200);
  //Reload the workspace page
  $scope.reloadingTheEnterprise = function(id){
    $timeout(function() {
      NodeService.getSubNodesById(id, $scope.nodes);
    }, 300);
    // Delay expansion
    $timeout(function() {
      ionicMaterialMotion.fadeSlideInRight();
      console.log("reloading the enterprisePage");
      for (var index in $scope.nodes.data[$scope.nodes.currentIndex]) {
        NodeService.parseNode($scope.nodes.data[$scope.nodes.currentIndex][index]);
      }
    }, 2000);
  };

  //Functionality for the <Delete> button after user presses it in the action menu of a node
  $scope.showDeleteConfirm = function(name, id, parentId) {
    console.log(parentId);
    var confirmPopup = $ionicPopup.confirm({
     title: 'Delete',
     template: 'Do you really want to delete ' + name + '?'
   });

    confirmPopup.then(function(res) {
     if(res) {
       NodeService.deleteNode(id);
       $scope.reloadingTheEnterprise(parentId);
     } else {
       console.log('cancel deleting');
     }
   });
  };
  // Action Menu for a node and its options
  $scope.show = function() {
    // Show the action sheet
    var that = this;
    var hideSheet = $ionicActionSheet.show({
      buttons: [
      { text: 'View' },
      { text: 'Add To Favourites' },
      { text: 'Download'}
      ],
      destructiveText: 'Delete',
      titleText: 'ACTIONS',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
        hideSheet();
      },
    //Functionality defined for clicking any of the 3 buttons: <View> , <Add to Favourites>, <Download>
    //***IN PROGRESS***//
    buttonClicked: function(index, button) {
        //If <View> is clicked
        if (index === 0) {
          $scope.nodes.currentIndex++;
          //IF FOLDER IS ALREADY STORED IN NODES, USE THAT INSTEAD OF NODE SERVICE
          console.log($scope.nodes.currentIndex);
          console.log(that.node.name);
          console.log($scope.nodes.data[$scope.nodes.currentIndex]);
          if ($scope.nodes.currentIndex > 1 && $scope.nodes.data[$scope.nodes.currentIndex] != null && that.node.name === $scope.nodes.data[$scope.nodes.currentIndex].name) {
            $timeout(function () {
              ionicMaterialMotion.fadeSlideInRight();
            }, 250);}
          } else if(index === 1){
            NodeService.addFavoriteNodes(that.node.id);
          }
          else if (index === 2){
          //NodeService.getUserInfo(that.node.wnd_owner, "name")
          NodeService.getRecentlyAccessed();
        } else {
          NodeService.getSubNodesById(that.node.id, $scope.nodes);
          delayExpansion();
        }

        return true;
      },

    //Functionality defined for clicking <Delete> in the node's Action Menu
    destructiveButtonClicked: function() {
        //$scope.nodes.currentIndex++;
        that.showDeleteConfirm(that.node.name, that.node.id, that.node.parent_id);
        return true;
      }

    });
};
  // Activate ink for controller
  ionicMaterialInk.displayEffect();
})


//Controller for the Favourites Page
.controller('FavoritesCtrl', function($scope, $stateParams, $timeout, $state, $ionicActionSheet, ionicMaterialInk, ionicMaterialMotion, NodeService) {
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);


  $scope.show = function() {
    // Show the action sheet
    var that = this;
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'View' },
        { text: 'Download'}
      ],
      titleText: 'ACTIONS',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
        hideSheet();
      },

      buttonClicked: function(index, button) {
        //If "View" is clicked
        if (index === 0) {
            $state.go('app.enterprise',{nodeId: that.node.data.properties.id});
        }
        return true;
      }
    });

    // GO TO SPECIFIC NODE IN ENTERPRISE PAGE
    //$state.go(enterprisepage + "/" + nodeId)

  };

  $scope.nodes = {data: createArray(25, null),currentIndex: 0, currentFolder: ""};

  $scope.destinationFavorite = '/img/icons/switch_favourite_on.svg';
  $scope.favoritesSwitch = function(index, id){
    console.log(index);
    var favoriteStar = angular.element(document.querySelectorAll('div.list span')[index]);
    if(favoriteStar.css('background-image') == 'url("/img/icons/switch_favourite_on.svg")'){
      NodeService.deleteFavoriteNodes(id);
      favoriteStar.css('background-image','url("/img/icons/switch_favourite.svg")');
      console.log("Remove from favorite");
    }
    else{
      NodeService.addFavoriteNodes(id);
      favoriteStar.css('background-image','url("/img/icons/switch_favourite_on.svg")');
      console.log("Add to favorite");
    }
  }

  NodeService.getFavoriteNodes($scope.nodes);
  delayExpansion();
  $timeout(function() {
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
  }, 300);

  function delayExpansion(){
    $timeout(function() {
      ionicMaterialMotion.fadeSlideInRight();
      for (var index in $scope.nodes.data[$scope.nodes.currentIndex]) {
        NodeService.parseFavoriteNode($scope.nodes.data[$scope.nodes.currentIndex][index]);
      }
    }, 2000);
  }

  function createArray(len, itm) {
    var arr1 = [itm],
    arr2 = [];
    while (len > 0) {
      if (len & 1) arr2 = arr2.concat(arr1);
      arr1 = arr1.concat(arr1);
      len >>>= 1;
    }
    return arr2;
  }
  // Activate ink for controller
  ionicMaterialInk.displayEffect();

  ionicMaterialMotion.pushDown({
    selector: '.push-down'
  });
  ionicMaterialMotion.fadeSlideInRight({
    selector: '.animate-fade-slide-in .item'
  });

});
