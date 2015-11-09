(function(){
	'use strict';
	/**
	* app Module
	*
	* Description
	*/
	angular
		.module('app.layout', [])
		.controller('TopNavController',TopNavController);

	TopNavController.$inject = [];
	function TopNavController($location,$state, $interval, store, SocketSvc, UserSvc, $window){
		var vm = this; 
		vm.currentTime =  moment().format('MMM Do, h:mm:ss a');
		vm.logout = logout;


		$interval(function(){
			moment.locale('zh-tw');
			vm.currentTime =  moment().format('MMM Do, h:mm:ss a');
		}, 1000);
		 
		function logout(){
			var account = UserSvc.currentAccount();
			SocketSvc.emit('logout');
			$state.go('anon.login');
		};
	}

})();