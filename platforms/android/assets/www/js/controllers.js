/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $ionicPopup) {
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
})

.controller('EnterpriseCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicActionSheet, $ionicPopup, NodeService) {
  // Set Header
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.$parent.setHeaderFab('left');
  $scope.nodes = {data: null};
  // Triggered on a button click, or some other target
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
      buttonClicked: function(index, button) {
        if (index === 0) {
          NodeService.getSubNodesById(that.node.id, $scope.nodes);
          // Delay expansion
          $timeout(function() {
            ionicMaterialMotion.fadeSlideInRight();
            console.log("Aasdasd");
            for (var index in $scope.nodes.data) {
              parseNode($scope.nodes.data[index]);
            }
          }, 2000);
        }
        return true;
      }
    });
  };

  NodeService.getSubNodesById(2000, $scope.nodes);
  // Delay expansion
  $timeout(function() {
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
  }, 500);

  // Delay expansion
  $timeout(function() {
    ionicMaterialMotion.fadeSlideInRight();
    console.log("Aasdasd");
    for (var index in $scope.nodes.data) {
      parseNode($scope.nodes.data[index]);
    }
  }, 2000);

  function parseNode(node){
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
      } else {
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

  }
  // Set Ink
  ionicMaterialInk.displayEffect();


})

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

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
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

  // Activate ink for controller
  ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);

  // Activate ink for controller
  ionicMaterialInk.displayEffect();

  ionicMaterialMotion.pushDown({
    selector: '.push-down'
  });
  ionicMaterialMotion.fadeSlideInRight({
    selector: '.animate-fade-slide-in .item'
  });

})
;
