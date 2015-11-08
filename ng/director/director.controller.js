(function(){
	'use strict';
	/**
	* app.director Module
	*
	* Description
	*/
	angular
		.module('app.director')
		.controller('DirDutyListController',DirDutyListController);

	DirDutyListController.$inject = ['UserSvc', 'BranchSvc'];

	function DirDutyListController( UserSvc , BranchSvc ){
		var vm = this;
		var branch = UserSvc.userBranch();
		
		BranchSvc.fetchByName(branch).success(function(branch){
			vm.branch 		= branch;
			vm.onDutyTotal 	= vm.branch.members.filter(function(member) {
				return member.onDuty == true 
			});
		}); 
	};
})();