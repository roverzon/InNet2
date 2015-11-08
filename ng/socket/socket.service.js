(function(){
	'use strict';
	/**
	* app.socket Module
	*
	* Description
	*/
	angular
		.module('app.socket')
		.service('SocketSvc',SocketSvc);

	SocketSvc.$inject = ['$rootScope', 'store', '$q', '$timeout'];
	
	function SocketSvc($rootScope, store, $q, $timeout){
		var svc = this; 
		svc.init =  function(token){
	    	var authToken = null
	    	if (token) {
		      authToken = token 
			} else {
		      authToken = store.get('jwt')
		    };
		    return io.connect('http://localhost:3000',{ query : 'token=' + authToken , 'forceNew':true });
		}

	  	var socket = svc.init();

	  	svc.on =  function (eventName, callback) {
	    	svc.init().on(eventName, function () {  
		      var args = arguments;
		      $rootScope.$apply(function () {
		        callback.apply(socket, args);
		      });
		    });
		};

	  	svc.emit =  function (eventName, data, callback) {
	    	svc.init().emit(eventName, data, function () {
	      		var args = arguments;
	      		$rootScope.$apply(function () {
	        		if (callback) {
	          			callback.apply(socket, args);
	        		};
	      		});
	    	})
	  	};

		svc.removeAllListeners = function (eventName, callback) {
		    svc.init().removeAllListeners(eventName, function() {
		        var args = arguments;
		        $rootScope.$apply(function () {
		          callback.apply(socket, args);
		        });
		    }); 
		};
	};
})();