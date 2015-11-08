(function(){
	'use strict';
	/**
	* app.safety Module
	*
	* Description
	*/
	angular
		.module('app.safety')
		.controller('SafetySettingController',SafetySettingController);

	SafetySettingController.$inject = ['strikeTeam', '$modalInstance', 'StSvc', '$state', 'MemberSvc', 'CaseSvc', '$stateParams', 'SocketSvc', 'caseDetail'];
	
	function SafetySettingController(strikeTeam, $modalInstance, StSvc, $state, MemberSvc, CaseSvc, $stateParams, SocketSvc, caseDetail){
		var vm = this; 
		vm.strikeTeam = strikeTeam;
		vm.chooseBranch = chooseBranch;
		vm.cancel = cancel;
		vm.check = check;
		vm.uncheck = uncheck;
		vm.save = save;   
		caseDetail.env == '住宅火警'? vm.apartment =  true  : vm.apartment = false 

		var newMembers = [];

		CaseSvc.fetchDetails($stateParams.caseId).success(function(details){
			vm.dispatch = details.branchIds;
			vm.currentBranch = vm.dispatch[0].name;
			var memberList = _.pluck(details.branchIds,'members');
			vm.members = []
			memberList.forEach(function(branchMembers){
				vm.members.push.apply(vm.members, branchMembers)
			});
			vm.members = vm.members.filter(function(member) { return !member.isChecked });
		})

		function chooseBranch(branch){
			vm.currentBranch = branch;
		};

		function cancel(){
			$modalInstance.dismiss('cancel');
		};

		function check(member){
			member.isChecked = !member.isChecked;
			newMembers.push(member);
		};

		function uncheck(member, id){
			member.isChecked = !member.isChecked;
			newMembers.splice(_.pluck(newMembers, '_id').indexOf(member._id),1);
		};

		function save(){
			vm.strikeTeam.members.push.apply(vm.strikeTeam.members, newMembers);
			SocketSvc.emit('updateStrikeTeam',{
				id : strikeTeam._id, 
				position : strikeTeam.position,
				area : strikeTeam.area, 
				floor : strikeTeam.floor,
				group : strikeTeam.group,
				memberIds : _.pluck(vm.strikeTeam.members,'_id'), 
				members : vm.strikeTeam.members
			});

			$modalInstance.close('dismiss');			
		};
	};

})();