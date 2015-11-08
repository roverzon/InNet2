(function(){
	'use strict';
	/**
	* app.safety Module
	*
	* Description
	*/
	angular
		.module('app.safety')
		.controller('SafetyManageController',SafetyManageController);
	
	SafetyManageController.$inject = ['$stateParams', '$modal', 'StSvc', '$state', 'MemberSvc','$log', 'UserSvc', 'BranchSvc', 'SocketSvc', 'CaseSvc', 'StMissionFac'];
	
	function SafetyManageController($stateParams, $modal, StSvc, $state, MemberSvc,$log, UserSvc, BranchSvc, SocketSvc, CaseSvc, StMissionFac){
		var vm = this; 
		var BRANCH 		= UserSvc.userBranch();
		var caseDetail 	= null;
		vm.quickStart 	= false;
		vm.apartment 	= true; 
		vm.ACCESSLEVEL 	= UserSvc.accessLevel();
		vm.quickOrganizing = quickOrganizing;
		vm.strikeTeam = strikeTeam;
		vm.openSettingModal = openSettingModal;
		vm.dismiss = dismiss; 

		vm.branchOptions = {
			branch : BRANCH,
			branches : []
		};

		CaseSvc.fetchById($stateParams.caseId).success(function(_case){
			caseDetail = _case;
			_case.env == '住宅火警'? vm.apartment = true : vm.apartment = false; 
			vm.branchOptions.branches = _case.branches
			vm.branchOptions.branches.splice(0,0,BRANCH);
		});

		BranchSvc.fetchByName(BRANCH).success(function(details){
			vm.details = details;
		}).then(function(){
			if (vm.ACCESSLEVEL > 1 ) {
				StSvc.fetchByCase($stateParams.caseId).success(function(sts){
					vm.strikeTeams = sts; 
				});
			} else {
				StSvc.fetch($stateParams.caseId,BRANCH).success(function(sts){
					vm.strikeTeams = sts;
					if (vm.details.dispatchNum < 8 && _.isEmpty(vm.strikeTeams)) { vm.quickStart = true  }; 
				}); 
			};
		});

		SocketSvc.on('newSt', function(st){
			if (vm.ACCESSLEVEL > 1 && angular.equals($stateParams.caseId,st.caseId) ) {
					vm.strikeTeams.push(st);
			} else {
				if (angular.equals(BRANCH,st.branch) && angular.equals($stateParams.caseId,st.caseId) ) {
					vm.strikeTeams.push(st);
				};
			};
		});

		SocketSvc.on('updateSt', function(data){
			var members = angular.copy(data.members);
			for (var i = vm.strikeTeams.length - 1; i >= 0; i--) {
				if(angular.equals(vm.strikeTeams[i]._id,data.id)){
					vm.strikeTeams[i].position 	= data.position;
					vm.strikeTeams[i].area 		= data.area;
					vm.strikeTeams[i].floor 	= data.floor;
					vm.strikeTeams[i].mission 	= data.mission;
				};
			};
		})

		SocketSvc.on('dismiss', function(st){
			var _stId = st.stId;
			vm.strikeTeams = vm.strikeTeams.filter(function(st) {				
				return st._id != _stId;
			});
		});
		
		function strikeTeam(){
			var modalInstance = $modal.open({
			  	templateUrl: 'views/safety/safety.modal.html',
			    controller: 'SafetyModalCtrl',
			    size: "md",
			    resolve : {
			    	stId : function(){
			    		if ( _.isEmpty(vm.strikeTeams)) {
			    			return 0
			    		} else{
			    			return vm.strikeTeams[vm.strikeTeams.length-1].id;
			    		};
			    	},
			    	branch : function(){
			    		return vm.branchOptions.branch;
			    	},
			    	caseDetail : function(){
			    		return caseDetail
			    	}
			    }
		    });
		};

		
		function openSettingModal(strikeTeam, id){
	        var modalInstance = $modal.open({
	            templateUrl: 'views/safety/safety.setting.modal.html',
	            controller: 'SafetySettingCtrl',
	            size: "lg",
	            resolve: {
	                strikeTeam : function(){
	                    return strikeTeam;
	                },
	                caseDetail : function(){
	                	return caseDetail;
	                }
	            }
	        });
	    };

		
		function dismiss(strikeTeam , id){

			SocketSvc.emit("dismissStrikeTeam",{
				id : strikeTeam._id,
				members : strikeTeam.members 
			});
	       	vm.strikeTeams.splice(id,1);
		};

		
		function quickOrganizing(){
			vm.quickStart = false;
		
			var members =  vm.details.members.filter(function(member) {
				if ( member.mission == '司機' || member.mission == '安全管制員' || member.mission == '救護人員') {
					return false  
				}else {
					member.isChecked = true;
					return member.onDuty;
				}
			});

			var strikeTeam = {
				id 		  : 1,
				caseId 	  : caseDetail._id,
				branch 	  : UserSvc.userBranch(),
				director  : _.pluck(members.filter(function(member) { return member.mission == '帶隊官'}),'name')[0],
				position  : StMissionFac.position().defaultPos,
				positions : StMissionFac.position().poss,
				group     : StMissionFac.groups().branch[1],
				groups    : StMissionFac.groups().branch,
				area 	  : StMissionFac.area().defaultArea,
				areas 	  : StMissionFac.area().areas,
				floor 	  : 1, 
				floors    : [1,2,3,4,5],
				memberIds : _.pluck(members,'_id'),
				members   : members,
				creator   : UserSvc.currentUser(),
			};
	      	SocketSvc.emit("createStrikeTeam", strikeTeam);
		};

		vm.$on('$destroy', function (event) {
	        SocketSvc.removeAllListeners();
	    })
	}
})();