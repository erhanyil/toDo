angular.module('starter.controllers', ['ionic.closePopup'])

.controller('AppCtrl', function($scope,$rootScope, $ionicModal, $timeout, Notification, Server, Session,$window,$state,$ionicHistory,Rabbit,Handler) {
  
  Rabbit.run(); //CHECK THIS WHAT SHOULD I DO FOR '*IF DATE == CURR_DATE THEN ? *'


  $scope.data = {notification : true};
  $scope.session = Session.getSession();
  $rootScope.backgroundPanda = '';
  $rootScope.playlists = [];
  $dateInput= false;
  
  $scope.getItems = function(){
    Server.getItems($scope.session.userID).then(function(result) {
      $rootScope.playlists= result.data.userItemData;
      $scope.setBackgroundPanda();
    });
  }
  $scope.getItems();

  $scope.setBackgroundPanda = function(){
    if($scope.session.userID != null){
      if($rootScope.playlists == undefined || $rootScope.playlists.length == 0 ){
          $rootScope.backgroundPanda  = 'zzz';
      }else{
          $rootScope.backgroundPanda = '';
      }
    }else{
          $rootScope.backgroundPanda  = 'hello';
    }
  };

  $scope.edit = function(){
    Server.editItem($scope.data).then(function(response){
      $scope.getItems();
    });
  }

  $scope.types = [
    {name: 'Elektrik Faturası'},
    {name: 'Su Faturası'},
    {name: 'Telefon Faturası'},
    {name: 'Doğalgaz Faturası'},
    {name: 'Kira'},
    {name: 'Kredi Kartı'}
  ];
  $scope.toDoDate = new Date();

  //Notification.push();

  $ionicModal.fromTemplateUrl('templates/modals/createNewItem.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.createNewItem = modal;
  });

  $ionicModal.fromTemplateUrl('templates/modals/createNewUser.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.createNewUser = modal;
  });

  $ionicModal.fromTemplateUrl('templates/modals/loginModal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  $scope.closeModal = function() {
      $scope.loginModal.hide();
      $scope.createNewUser.hide();
      $scope.createNewItem.hide();
  };

  $scope.logout = function() {
    Session.clearSession();
  }

  $scope.openModal = function(modalID,itemID,index) {

    $scope.data = {};

    if (modalID == 1) {
      $scope.loginModal.show();
    } else if (modalID == 2) {
      $scope.createNewUser.show();
    } else if (modalID == 3 && itemID == undefined && itemID == null) {
      $scope.createNewItem.show();
    } else if (modalID == 3 && itemID != undefined && itemID != null) {
      $scope.data = $scope.playlists[index];
      //$scope.data.date = new Date($scope.data.date);
      $scope.createNewItem.show();
    } else {
      alert("Bir sorun oluştu");
    }

  };

  $scope.doAction = function(modalID,itemID) {
    if (modalID == 1) {
        Server.login($scope.data);
    }
    else if (modalID == 2) {
      if($scope.data.title != null || $scope.data.title != undefined){
        if($scope.data.detail != null || $scope.data.detail != undefined){
          if($scope.data.type != null || $scope.data.type != undefined){
            if($scope.data.date != null || $scope.data.date != undefined){
              Server.createNewUser($scope.data);
            } else {
                alert("Tüm alanları doldurunuz");
            }
          } else {
            alert("Tüm alanları doldurunuz");
            }
        } else {
          alert("Tüm alanları doldurunuz");
            }
      } else {
        alert("Tüm alanları doldurunuz");
            }
    
    } else if (modalID == 3 && itemID == undefined && itemID == null) {
        if($scope.session.isAuthenticated){
          Server.createNewItem($scope.data).then(function(response){
            $scope.getItems();
          });
        }else{
          if(confirm("Üye Değilsiniz. Şimdi üye olmak istermisiniz ?")){
            $scope.closeModal();
            $scope.openModal(2);
          }
        }
    }
    else if (modalID == 3 && itemID != undefined && itemID != null) {
        $scope.edit();
    }else{
      alert("Bir sorun oluştu");
    }

    $scope.getItems();
    $timeout(function() {
      $scope.closeModal();
    }, 1000);
  };


  $scope.refreshTasks = function() {
    console.log('Refreshing');
    $scope.getItems();
    $timeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.refreshComplete');
    }, 1250);
  };

})

.controller('PlaylistsCtrl', function($scope,$rootScope, IonicClosePopupService, $ionicPopup, $timeout, $window, Session, Server,Handler) {
 
  $scope.session = Session.getSession();
  
  $scope.getTemplate = function(){
    $scope.template = '<li class="item"><span>Içerik: </span>%detail%</li><li class="item"><span>Tür: </span>%type%</li><li class="item"><span>Tarih: </span>%date%</li>'
    return $scope.template;
  };
  
  $scope.templ = $scope.getTemplate();

   $scope.openItem = function(id) {
    $scope.templ = $scope.templ.replace("%detail%",$rootScope.playlists[id].detail);
    $scope.templ = $scope.templ.replace("%type%",$rootScope.playlists[id].type);
    $scope.templ = $scope.templ.replace("%date%",$rootScope.playlists[id].date);
    var confirmPopup = $ionicPopup.alert({
        title: $rootScope.playlists[id].title,
        template: $scope.templ,
        buttons: [{
         text: '<b>Tamam</b>',
         type: 'button-positive',
         onTap: function(e) {
            return;
         }
       }]
    });
     IonicClosePopupService.register(confirmPopup);
     $scope.templ = $scope.getTemplate();
  };

  $scope.delete = function(itemID,index){
    Server.deleteItem(itemID).then(function(response){
      var _s = $rootScope.playlists;
      var indexOfEl = _s.map(function(o) { return o.itemID; }).indexOf(itemID);
      $rootScope.playlists.splice(indexOfEl, 1);
      if($rootScope.playlists.length == 0){
        $scope.setBackgroundPanda();
      }    
    });
  };

  $scope.setBackgroundPanda = function(){
    if($scope.session.userID != null){
      if($rootScope.playlists == undefined || $rootScope.playlists.length == 0 ){
          $rootScope.backgroundPanda  = 'zzz';
      }
    }else{
          $rootScope.backgroundPanda  = 'hello';
    }
  };
})

.controller('PlaylistCtrl', function($scope, $stateParams, Session) {
});
