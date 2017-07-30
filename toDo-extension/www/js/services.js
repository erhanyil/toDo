angular.module('starter.services', [])

.constant('URL','http://www.google.com')

.factory('Notification', function() {
  return {
    push: function(options){
        var _notificationOptions = {
                title: null,
                body: null,
                dir: 'auto', 
                lang: 'EN', 
                tag: 'notificationPopup', 
                icon: 'img/icon.jpg'
        };
        _notificationOptions.title = options.title;
        _notificationOptions.body = "Tür: "+ options.type+" Detay: "+options.detail+" Tarih: "+options.date;
        var notification = null;
        if (!("Notification" in window)) {
          //navigator.notification.alert("notification.alert");
        }

        else if (Notification.permission === "granted") {
          var notification = new Notification(_notificationOptions.title ,_notificationOptions);
        }

        else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function (permission) {
          if(!('permission' in Notification)) {
            Notification.permission = permission;
          }
          if (permission === "granted") {
            var notification = new Notification(_notificationOptions.title ,_notificationOptions);
          }
        });
      }
      return notification;
    }
  };
})

.factory("Handler",function(){
  var _data;
  return {
    errorHandler: function(errorConsole,errorAlert){
      if(errorAlert != undefined && errorAlert != null){
        alert(errorAlert);
      }
      console.log("Error:" , errorConsole);
    },
    successHandler: function(successConsole,successAlert){
      if(successAlert != undefined && successAlert != null){
        alert(successAlert);
      }
      console.log("Success:" , successConsole );
    },
    messageHandler: function(messageConsole,messageAlert){
      if(messageAlert != undefined && messageAlert != null){
        alert(messageAlert);
      }
      console.log("Message:" , messageConsole );
    },
    varSetHandler: function(data){
      _data = data;
    },
    varGetHandler: function(){
      return _data;
    }
  };
})

.factory("Session",function($window,Handler){

  var sessionData = {
    userID: null,
    username: null,
    password: null,
    email: null,
    userType: null
  };

  var localData = sessionData;

  return {
    setSession: function(data) {
        sessionStorage.setItem('userID', data[0].userID);
				sessionStorage.setItem('username',  data[0].username);
				sessionStorage.setItem('password', data[0].password);
				sessionStorage.setItem('email', data[0].email);
				sessionStorage.setItem('userType', data[0].userType);
				sessionStorage.setItem('isAuthenticated', true);
        
        localStorage.setItem('userID', data[0].userID);
				localStorage.setItem('username',  data[0].username);
				localStorage.setItem('password', data[0].password);
				localStorage.setItem('email', data[0].email);
				localStorage.setItem('userType', data[0].userType);
				localStorage.setItem('isAuthenticated', true);

				// $ionicHistory.nextViewOptions({
				// 	disableAnimate: true,
				// 	disableBack: true
				// }); 
        Handler.messageHandler(localStorage);
        Handler.messageHandler(sessionStorage);
    },
    getSession: function() {
      sessionData.userID= sessionStorage.getItem('userID');
		  sessionData.username= sessionStorage.getItem('username');
	  	sessionData.password= sessionStorage.getItem('password');
	  	sessionData.email= sessionStorage.getItem('email');
		  sessionData.userType= sessionStorage.getItem('userType');
		  sessionData.isAuthenticated= sessionStorage.getItem('isAuthenticated');

      localData.userID= localStorage.getItem('userID');
		  localData.username= localStorage.getItem('username');
	  	localData.password= localStorage.getItem('password');
	  	localData.email= localStorage.getItem('email');
		  localData.userType= localStorage.getItem('userType');
		  localData.isAuthenticated= localStorage.getItem('isAuthenticated');

      Handler.messageHandler(localData);
      Handler.messageHandler(sessionData);

      if(sessionData.userID == null && sessionData.userID == undefined){
        return localData;
      }
      return sessionData;
    },
    clearSession: function(){
      delete sessionStorage.userID;
			delete sessionStorage.username;
			delete sessionStorage.password;
			delete sessionStorage.email;
			delete sessionStorage.userType;
			delete sessionStorage.isAuthenticated;

      delete localStorage.userID;
			delete localStorage.username;
			delete localStorage.password;
			delete localStorage.email;
			delete localStorage.userType;
			delete localStorage.isAuthenticated;

      sessionData = localData = {};
      Handler.messageHandler(sessionData);
      Handler.messageHandler(localData);
      $window.location.reload();
    },
  };
})

.factory("Rabbit",function(Server,Session,Notification){
  var _userID = Session.getSession().userID;
  return {
    run: function() {
        setInterval(function(){ 
          if(_userID != undefined && _userID != null) {
              Server.forRabbit(_userID).then(function(response){
                if(response.data.rabbitData != undefined && response.data.rabbitData.length != 0){
                    for(var i=0;i< response.data.rabbitData.length;i ++){
                      Notification.push(response.data.rabbitData[i]);
                    }
                }else if(response.data != '1'){
                  console.log("Response",response);
                }
              });
          }else{
            _userID = Session.getSession().userID;
          }
        }, 3000)
    },
  };
})

.factory('Server', function($http, Notification, Handler, $window,Session) {

  //var main_API_URL = "http://localhost/toDo/www/";
  var main_API_URL = "http://stdiosoft.com/toDo/www/";

  var createNewItem_API_URL = main_API_URL+'php/createNewItem.php';
  var createNewUser_API_URL = main_API_URL+'php/createNewUser.php';
  var getItems_API_URL = main_API_URL+'php/getItems.php';
  var deleteItem_API_URL = main_API_URL+'php/deleteItem.php';
  var editItem_API_URL = main_API_URL+'php/editItem.php';
  var login_API_URL = main_API_URL+'php/login.php';
  var forRabbit_API_URL = main_API_URL+'php/forRabbit.php';

  var _userLoginDataService;
  var _data = {};
  return {
    createNewItem: function(data){
        data.userID = -1;
        if(Session.getSession().isAuthenticated) {
          data.userID = Session.getSession().userID;
        }
        data.notification = data.notification ? 0 : 1;
        return $http.post(createNewItem_API_URL, data).success(function(response){
          if(response == 0){
            Handler.successHandler(response,"Listeye Başarıyla Eklendi");
          }else{
            Handler.errorHandler(response,"Bir Hata Meydana Geldi");
          }
        }).error(function(error) {
            Handler.errorHandler(error,"Bağlantı Hatası");
        });
    },

    createNewUser: function(data){
        $http.post(createNewUser_API_URL, data).success(function(response){
          if(response == 0){
            Handler.successHandler(response,"Başarıyla Kayıt Oldunuz");
          }else{
            Handler.errorHandler(response,"Bir Hata Meydana Geldi");
          }
        }).error(function(error) {
            Handler.errorHandler(error,"Bağlantı Hatası");
        });
    },

    login: function(data){
        $http.post(login_API_URL, data).success(function(response){
          if(response != '1' && response != undefined && response != null){
            Handler.successHandler(response,"Başarıyla Giriş Yapıtınız");
            _userLoginDataService = response.userLoginData;
            Session.setSession(_userLoginDataService);
            $window.location.reload();
          }else{
            Handler.errorHandler(response,"Yanlıs Kullanıcı Adı / Parolası");
          }
        }).error(function(error) {
            Handler.errorHandler(error,"Bağlantı Hatası");
        });
    },

    getItems: function(userID) {
        _data.userID = userID;
        _responseData = [];
        return $http.post(getItems_API_URL, _data).success(function(response){
          if(response != '1' && response != undefined && response != null){
            for(var i=0;i<response.userItemData.length;i++){
              response.userItemData[i].notification = response.userItemData[i].notification == 0 ? true : false;
            }
             return _responseData = response.userItemData;
          }else{
            Handler.errorHandler("Error:" +response);
          }
        }).error(function(error) {
            Handler.errorHandler(error,"Bağlantı Hatası");
        });
        return _responseData;
    },

    deleteItem: function(itemID) {
        _data.itemID = itemID;
        return $http.post(deleteItem_API_URL, _data).success(function(response){
          if(response == 0){
            Handler.successHandler(response,"Kayıt Başarıyla Silindi");
          }else{
            Handler.errorHandler(response,"Bir Hata Meydana Geldi :( ");
          }
        }).error(function(error) {
            Handler.errorHandler(error,"Bağlantı Hatası");
        });
    },

    editItem: function(data) {
        data.userID = Session.getSession().userID;
        data.notification = data.notification ? 0 : 1;
        return $http.post(editItem_API_URL, data).success(function(response){
          if(response == 0){
            Handler.successHandler(response,"Kayıt Başarıyla Düzenlendi");
          }else{
            Handler.errorHandler(response,"Bir Hata Meydana Geldi :( ");
          }
        }).error(function(error) {
            Handler.errorHandler(error,"Bağlantı Hatası");
        });
    },

    forRabbit: function(userID) {
        _data.userID = userID;
        _data.currentDate = new Date();
        _responseData = [];
        return $http.post(forRabbit_API_URL, _data).success(function(response){
          if(response != 1 && response != undefined && response != null){
             return _responseData = response.rabbitData;
          }else{
            Handler.errorHandler("Error:" +response);
          }
        }).error(function(error) {
            Handler.errorHandler(error);
        });
        return _responseData;
    }
  };
})

.service('Chrome', function ($q) {
    var _this = this;
    this.data = [];

    this.findAll = function(callback) {
        chrome.storage.sync.get('todo', function(keys) {
            if (keys.todo != null) {
                _this.data = keys.todo;
                for (var i=0; i<_this.data.length; i++) {
                    _this.data[i]['id'] = i + 1;
                }
                console.log(_this.data);
                callback(_this.data);
            }
        });
    }

    this.sync = function() {
        chrome.storage.sync.set({todo: this.data}, function() {
            console.log('Data is stored in Chrome storage');
        });
    }

    this.add = function (newContent) {
        var id = this.data.length + 1;
        var todo = {
            id: id,
            content: newContent,
            completed: false,
            createdAt: new Date()
        };
        this.data.push(todo);
        this.sync();
    }

    this.remove = function(todo) {
        this.data.splice(this.data.indexOf(todo), 1);
        this.sync();
    }

    this.removeAll = function() {
        this.data = [];
        this.sync();
    }
});