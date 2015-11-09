(function(){
	'use strict';
	/**
	* app.dutylist Module
	*
	* Description
	*/
	angular
		.module('app.dutylist')
		.controller('DutyListEditController', DutyListEditController);

	DutyListEditController.$inject = ['BranchSvc', '$stateParams','MemberSvc', '$location', '$window', 'UserSvc', 'CarSvc', 'StMissionFac'];
	function DutyListEditController(BranchSvc, $stateParams,MemberSvc, $location, $window, UserSvc, CarSvc, StMissionFac){
		var vm 		= this;
		vm.save 	= save;
		vm.check 	= check; 

		var branch = $stateParams.branch

		BranchSvc.totalListFindByName(branch).success(function(branch){
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
		});

		function check(member){
			member.onDuty = !member.onDuty;
			member.isChecked = !member.isChecked;
			member.groupID = member.group + member.groupId
		};

		function save(){
			var branchGroups =  _.groupBy(vm.branch.members,function(member){
				member.groupID = member.group + member.groupId;
				// member.isChecked = true;
				if (member.onDuty) { return member.groupID } else { return 'offDuty' };
			});
			delete branchGroups['offDuty']; 

		    var preStrikeTeams  = [];
		    var strikeTeamMembers = [];
		    var controlList = StMissionFac.groups().preSt; 
		    for (var key in branchGroups) {
		    	var strikeTeam = {
		      		caseId      : 'pending',
		      		branch      : branch,
		      		director    : vm.branch.director,
		      		position    : StMissionFac.position().defaultPos,
		      		positions   : StMissionFac.position().poss,
		      		groups      : StMissionFac.groups().branch, 
		      		area 		: StMissionFac.area().defaultArea,
		      		areas 		: StMissionFac.area().areas,
		      		floor 		: 1,
		      		floors 		: [1],
		      		creator 	: UserSvc.currentUser() 	
			     };
		    	
			    if ( controlList.indexOf(key.slice(0, key.length-1 )) > -1 ) {
			    
					strikeTeam.members = _.pluck(branchGroups[key],'_id');
					strikeTeam.group = key;
					strikeTeam.workingTime = _.min(branchGroups[key], function(member){ return member.workingTime }).workingTime;
					preStrikeTeams.push(strikeTeam)
					strikeTeamMembers.push.apply(strikeTeamMembers,strikeTeam.members)
				};
		    };

			var DispatchNumber = vm.branch.members.filter(function(member) {
				return member.onDuty
			});

			vm.branch.members.forEach(function(member){
				member.isChecked = true ? strikeTeamMembers.indexOf(member._id) > -1 : false
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
	}
})();