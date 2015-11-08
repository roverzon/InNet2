(function(){
	/**
	* app.dashboard Module
	*
	* Description
	*/
	angular
		.module('app.dashboard')
		.controller('DashboardController',DashboardController);

	DashboardController.$inject = ['$location', 'SocketSvc', 'UserSvc', 'BranchSvc'];
	function DashboardController($location, SocketSvc, UserSvc, BranchSvc){
		var vm = this; 

		BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
			return vm.branches = branches;
		});

		UserSvc.fetchOnlineUser().success(function(users){
			return vm.users = users;
		});

		SocketSvc.on('userLogin',function(user){
			return vm.users.push(user);
		});

		SocketSvc.on('userDisconnect',function(disconnectUser){
			vm.users = vm.users.filter(function(user) {
				return user.username != disconnectUser.username
			});
		});

		SocketSvc.on('userLogout',function(logoutUser){
			vm.users = vm.users.filter(function(user) {
				return user.username != logoutUser.username
			});
		});

		vm.$on('$destroy', function (event) {
	        return SocketSvc.removeAllListeners();
	    });
	}
})();