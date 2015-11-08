(function(){
	'use strict';
	/**
	* app.safety Module
	*
	* Description
	*/
	angular
		.module('app.safety')
		.controller('SafetyIndexController',SafetyIndexController);
	SafetyIndexController.$inject = ['CaseSvc', 'UserSvc'];
	function SafetyIndexController(){
		var vm = this; 
		var userCondition = {
			branch 		: UserSvc.userBranch(),
			accessLevel : UserSvc.accessLevel(),
			corps 		: UserSvc.userCorps()
		};

		CaseSvc.fetchRelativeCase(userCondition).success(function(cases){ 
			vm.cases = cases;
			cases.forEach(function(_case){
				_case.dispatchBranches = ''
				_case.branches.forEach(function(branch){
					_case.dispatchBranches += branch + ' '
				});
			});
		});

		vm.isBranchMember = true ? UserSvc.accessLevel() < 2  : false ; 
	}
})();