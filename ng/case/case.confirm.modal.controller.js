(function(){
	'use strict';
	/**
	* app.case Module
	*
	* Description
	*/
	angular
		.module('app.case')
		.controller('CaseConfirmController',CaseConfirmController);

	CaseConfirmController.$inject = ['UserSvc', 'CaseSvc', '$stateParams','$state','$modalInstance'];
	function CaseConfirmController(UserSvc, CaseSvc, $stateParams,$state,$modalInstance){
		var vm = this;
		
		vm.user = {};
		vm.send = send; 
		vm.caseInfo = {
			id : $stateParams.id,
			endAt : moment().format('YYYY-MMM-DD, h:mm:ss a')
		}; 

		function send(){
			UserSvc.login(vm.user).success(function(data){
				CaseSvc.closeCase(vm.caseInfo).success(function(){
					$modalInstance.dismiss('cancel');
					$state.go('dutyDesk.case.index');
				})
			});
		};
	};
})();