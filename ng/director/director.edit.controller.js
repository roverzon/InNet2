(function(){
	'use strict';
	/**
	* app.dashboard Module
	*
	* Description
	*/
	angular
		.module('app.director')
		.controller('DirDutyListEditController',DirDutyListEditController);

	DirDutyListEditController.$inject = ['BranchSvc', '$stateParams','MemberSvc', '$location', '$window', 'UserSvc', 'CarSvc', 'StMissionFac'];

	function DirDutyListEditController(BranchSvc, $stateParams,MemberSvc, $location, $window, UserSvc, CarSvc, StMissionFac){
		var vm = this;
		var branch 	= UserSvc.userBranch();
		vm.check 	= check;
		vm.save 	= save;   

		BranchSvc.fetchByName(branch).success(function(branch){
			vm.branch = branch;
			vm.isCorps =  true ? branch.name.split("救災救護")[1] : false 
			var members = _.pluck(branch.members.filter(function(member) { return member.level < 2.4 }), 'name')
			vm.branch.safetyManager 	= branch.safetyManager;
			vm.branch.safetyManagers 	= members;
			vm.onDutyTotal = 0;
			_.map(vm.branch.members,function(member){ 
				member.groupIds = _.range(1,Math.round(vm.branch.members.length/6),1);
				member.groupID = member.group + member.groupId 
			})
		})

		function check(member){
			member.onDuty 	 = !member.onDuty;
			member.isChecked = !member.isChecked;
			member.groupID 	 = member.group + member.groupId
		};

		
		function save(){
			var DispatchNumber = vm.branch.members.filter(function(member) {
				return member.onDuty
			});

			BranchSvc.updateMission({
				branch   		: vm.branch.name,
				director 		: vm.branch.director,
				dispatchNum 	: DispatchNumber.length,
				safetyManager 	: vm.branch.safetyManager,
				members 		: vm.branch.members
			});
			$window.history.back();
		};
	};

})();