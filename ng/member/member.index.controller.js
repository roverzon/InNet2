(function(){
	'use strict';

	/**
	* app.member Module
	*
	* Description
	*/
	angular
		.module('app.member', [])
		.controller('MemberIndexController',MemberIndexController);

	MemberIndexController.$inject = [ MemberSvc , $stateParams ];
	function MemberIndexController( MemberSvc , $stateParams ){
		var vm = this; 

		vm.branch = $stateParams.branch;
		MemberSvc.findByBranch($stateParams.branch).success(function(members){
			vm.members = members;
			vm.members.forEach(function(member){
				return member.workingTime = moment.duration(member.workingTime,'seconds');
			});
		});
	};
})();