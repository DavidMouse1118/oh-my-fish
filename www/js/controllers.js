/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])
//Controller for the whole app.
// This is where you can define methods or actions that stay constant throughout the app
.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $ionicPopover, $timeout, $ionicPopup, NodeService) {
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

  $scope.hideTab = function() {
      var tab = angular.element(document.querySelector('.tabs-icon-top'));
      tab.css('display', 'none');
  };

  $scope.showTab = function() {
    var tab = angular.element(document.querySelector('.tabs-icon-top'));
    tab.css('display', 'block');
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
  console.log($rootScope.name);
  $scope.username = '';

})

//Controller for the Enterprise Workspace page
//Here are defined the methods and actions specific to user behaviour allowed on the Enterprise Workspace page
.controller('EnterpriseCtrl', function($scope, $stateParams, $state, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicActionSheet, $ionicPopup,$firebaseArray, NodeService) {
  // Set Header
   var ref = new Firebase("https://oh-my-fish.firebaseio.com/");

  console.log($stateParams);
  $scope.$parent.showHeader();
  $scope.$parent.showTab();
  $scope.$parent.clearFabs();
  $scope.$parent.setHeaderFab('left');
  $scope.nodes = $firebaseArray(ref.child)

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
        { text: 'Download'}
      ],
      destructiveText: 'Delete',
      titleText: 'ACTIONS',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
        hideSheet();
      },


    //Functionality defined for clicking any of the 2 buttons: <View>, <Download>
    //***IN PROGRESS***//
    buttonClicked: function(index, button) {
        //If <View> is clicked
        if (index === 0) {
          //$scope.nodes.currentIndex++;
          //switch to detail View
          $state.go('app.log_detail', {'log_id': 1});
        }
        else {
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
.controller('LoginCtrl', function($rootScope, $scope, $timeout, $state, $stateParams, ionicMaterialInk, AuthenticationService) {
  $scope.$parent.clearFabs();

  $timeout(function() {
    $scope.$parent.hideHeader();
  }, 0);

  $timeout(function() {
    $scope.$parent.hideTab();
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

  $scope.auth = function(user, pass){
    $state.go("app.favorites");
    $rootScope.name = user;
  }

  $scope.authenticate = AuthenticationService.login;
})

/*
 * Controller for operation detail page
 */
.controller('DetailCtrl', function ($scope, $stateParams, $timeout, $ionicHistory, ionicMaterialMotion, ionicMaterialInk) {
  // Set Header
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);
  $scope.goBack = function () {
    $ionicHistory.goBack();
  }
   // console.log($statePar);
   ionicMaterialMotion.blinds();
   ionicMaterialInk.displayEffect();
})

.controller('NewlogCtrl', function($scope, $ionicPopover, $ionicLoading, $compile, $stateParams, $timeout, $state, $ionicActionSheet, ionicMaterialInk, ionicMaterialMotion, NodeService) {
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);


  ionicMaterialMotion.blinds();
  ionicMaterialInk.displayEffect();
})
//Controller for the Nearby location Page
.controller('FavoritesCtrl', function($scope, $ionicPopover, $ionicLoading, $compile, $stateParams, $timeout, $state, $ionicActionSheet, ionicMaterialInk, ionicMaterialMotion, NodeService) {
  $scope.$parent.showHeader();
  $scope.$parent.showTab();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);

    $scope.navTitle = 'Google Map';
    $scope.$on('$ionicView.afterEnter', function(){
      if ( angular.isDefined( $scope.map ) ) {
        google.maps.event.trigger($scope.map, 'resize');
      }
    });


    function initialize() {
      //var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
      var myLatlng = new google.maps.LatLng(43.6427197,-69.38397530000002);
      var myLatlng2 = new google.maps.LatLng(38.9072,-74.0369);
      console.log(myLatlng);
      var mapOptions = {
        center: myLatlng,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);

      //Marker + infowindow + angularjs compiled ng-click
      var contentString =' <div class="card-item">  <div style = "left: 7%;  top: 11%;  width: 53%;  height: 22px"><a href="#" style="width: 56%;position: absolute;left: 0;top: 0;">View Details>></a></div><div class="stable-bg ink ink-dark" style="background-color: #FFF">  <div class="item item-avatar item-text-wrap" style="border: none; padding:0; text-align: center;"> <strong style="font-size: 17px">Salmon：75%{{node.data.assignments.name}}</strong>  <p style="padding-top:4px">Avg Weight:700kg {{node.data.assignments.owner_name}}</p>  <p>Avg Fish Lenth: 12-inch {{node.data.assignments.workflow_name}}</p>    </div>  </div></div>';
      var contentString2 =' <div class="card-item">  <div style = "left: 7%;  top: 11%;  width: 53%;  height: 22px"><a href="#" style="width: 56%;position: absolute;left: 0;top: 0;">View Details>></a></div><div class="stable-bg ink ink-dark" style="background-color: #FFF">  <div class="item item-avatar item-text-wrap" style="border: none; padding:0; text-align: center;"> <strong style="font-size: 17px">Cod：80%{{node.data.assignments.name}}</strong>  <p style="padding-top:4px">Avg Weight:900kg {{node.data.assignments.owner_name}}</p>  <p>Avg Fish Lenth: 10-inch {{node.data.assignments.workflow_name}}</p>    </div>  </div></div>';
      //var contentString ='<div class="item card-item"><div class="card stable-bg ink ink-dark" style="background-color: #FFF"><div class="item item-avatar item-text-wrap"><span class="avatar" style="background-image: url(img/fish-icon.jpg); background-size:40px 40px; background-repeat: no-repeat"></span>  <strong style="font-size: 17px">Salmon：75%{{node.data.assignments.name}}</strong><p style="padding-top:4px">Assigned By: lpl {{node.data.assignments.owner_name}}</p>    <p>Workflow:xkjvgdkjshfv {{node.data.assignments.workflow_name}}</p><div class="card-footer" style="width:120%; left:-65px; position: relative">  <i class="icon ion-clock" style="color: grey;position: relative;font-size:36px"> </i><span ng-show="node.data.assignments.date_due != null" style="padding-right: 1rem">saJDHFGAKEWLI;FYEARGJKFGH{{node.data.assignments.date_due.substring(12,16) + " || "  + node.data.assignments.date_due.substring(0,10)}}</span><span ng-show="node.data.assignments.date_due == null" style="padding-right: 1rem">N/A</span><i class="icon ion-flag" style="color: grey; position: relative; font-size:36px"></i> KJDSFSAEFGLER{{node.data.assignments.status_name}}  <i class="icon ion-alert" style="color: red; position: relative; font-size:36px"></i> SAJHDFEWAJFGJW{{node.data.assignments.priority_name}}  </div>  </div>  </div>  </div>  ';
      var compiled = $compile(contentString)($scope);
      var compiled2 = $compile(contentString2)($scope);

      var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
      });
      var infowindow2 = new google.maps.InfoWindow({
        content: compiled2[0]
      });

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Pune(India)'
      });

      var marker2 = new google.maps.Marker({
        position: myLatlng2,
        map: map,
        title: 'Pune(India)'
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
        //$scope.show();
        //$scope.openPopover();
      });
      google.maps.event.addListener(marker2, 'click', function() {
        infowindow2.open(map,marker2);
        //$scope.show();
        //$scope.openPopover();
      });

      $scope.map = map;
    }
    initialize();

    $scope.centerOnMe = function() {
      if(!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log(pos);

        var mapOptions = {
          center: pos,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'Pune(India)'
        });
        $scope.map.setCenter(pos);

        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'jhfsjfh'
        });
        //  console.log(pos.);
        $scope.loading.hide();
      }, function(error) {
        alert('Unable to get location: ' + error.message);
      });
    };

    $scope.clickTest = function() {
      alert('Example of infowindow with ng-click')
    };

  });
