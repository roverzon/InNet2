(function(){
	'use strict';
	/**
	* app.user Module
	*
	* Description
	*/
	angular
		.module('app.user')
		.service('UserSvc',UserSvc);

	UserSvc.$inject = ['$http', 'store', 'jwtHelper'];
	function UserSvc(){
		var svc = this; 
		svc.fetchOnlineUser = fetchOnlineUser;
		svc.activate = activate;
		svc.removeUser = removeUser;
		svc.login = login;
		svc.isLoggedIn = isLoggedIn;
		svc.isValid = isValid;
		svc.userBranch = userBranch;
		svc.userCorps = userCorps;
		svc.currentUser = currentUser;
		svc.currentAccount = currentAccount;
		svc.accessLevel = accessLevel;
		svc.caseId = caseId;


		function fetchOnlineUser(){
			return $http.get('/api/users/userState');
		};

		function activate(user){
			return $http.post('/api/users', user);
		};

		function removeUser(username){
			return $http.delete('/api/users/delete?username=' + username);
		};

		function login(user){
			return $http.post('/api/users/authenticate', user);
		};

		function isLoggedIn(){
			return store.get('jwt');
		};

		function isValid( branch ){
			if (svc.isLoggedIn) {
				if (jwtHelper.decodeToken(store.get('jwt')).accessLevel > 1   || jwtHelper.decodeToken(store.get('jwt')).branch == branch) {
					return true; 
				}else {
					return false;
				};
			};

			return false 
		};

		function userBranch(){
			if (svc.isLoggedIn) {
				return jwtHelper.decodeToken(store.get('jwt')).branch;
			};
		};
	
		function userCorps(){
			if (svc.isLoggedIn) {
				return jwtHelper.decodeToken(store.get('jwt')).corps;
			};
		};
	
		function currentUser(){
			if (svc.isLoggedIn) {
				return jwtHelper.decodeToken(store.get('jwt')).username;
			};
		};
	
		function currentAccount(){
			if (svc.isLoggedIn) {
				return jwtHelper.decodeToken(store.get('jwt')).account;
			}; 
		};
	
		function accessLevel(){
			if (svc.isLoggedIn) {
				return jwtHelper.decodeToken(store.get('jwt')).accessLevel;
			};
		};
	
		function caseId(){
			if (svc.isLoggedIn) {
				return jwtHelper.decodeToken(store.get('jwt')).caseId;
			};
		};
	};

})();