;(function(){
	'use strict';
	/**
	* app Module
	*
	* Description
	*/
	angular
		.module('app')
		.controller('LoginController',LoginController);

		LoginController.$inject = ['UserSvc', 'store', '$state','jwtHelper','$http', 'SocketSvc'];

		function LoginController(UserSvc, store, $state,jwtHelper,$http, SocketSvc ){
			var vm 	 = this; 
			vm.login = login;
			vm.user  = {};

			function login(){
				UserSvc.login(vm.user).success(function(data){
					if (data.success) {
						store.set('jwt',data.token);
						$http.defaults.headers.common['x-access-token'] = data.token;
						return data.token; 
					} else { 
						return console.log("password is not existed");
					}
				}).then(function(token){
					SocketSvc.init(token);
					SocketSvc.emit('login');
				}).then(function(){
					if (jwtHelper.decodeToken(token).role == "admin") {
						var userBranch = jwtHelper.decodeToken(token).branch;
						if (userBranch.slice(userBranch.length-2 ,userBranch.length) == "大隊") {
							return $state.go('dutyDesk.corps')
						} else{
							return $state.go('dutyDesk.branch')
						};
					}else{
						return $state.go('director.safety.index')
					}
				})
			};
		};
})();