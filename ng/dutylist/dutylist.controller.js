(function(){
	/**
	* app.dutylist Module
	*
	* Description
	*/
	angular
		.module('app.dutylist', [])
		.controller('DutyListController',DutyListController);

	DutyListController.$inject = ['BranchSvc', '$stateParams', 'SocketSvc', 'UserSvc', '$q'];
	function DutyListController(BranchSvc, $stateParams, SocketSvc, UserSvc, $q){
		var vm = this; 
		var branchId = $stateParams.branch;
		
		BranchSvc.totalListFindByName(branchId).success(function(branch){
			vm.branch = branch;
			vm.onDutyTotal = vm.branch.members.filter(function(member) {
				return member.onDuty == true
			});
		});
	}

})();