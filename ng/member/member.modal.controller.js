(function(){
	'use strict';
	/**
	* app.member Module
	*
	* Description
	*/
	angular
		.module('app.member')
		.controller('MemberModalController',MemberModalController);

	MemberModalController.$inject = ['branch', 'MemberSvc', '$modalInstance', '$state', 'member','BranchSvc', 'UserSvc'];
	function MemberModalController(branch, MemberSvc, $modalInstance, $state, member,BranchSvc, UserSvc){
		var vm = this; 
		vm.alerts = [];
		vm.isNew  = _.isNull(member.workingTime);
		vm.save   = save;
		vm.update = update;
		vm.cancel = canel;

		vm.member = {
			id 		 	: member.id ||  "", 
			name 	 	: member.name || null , 
			title    	: "消防隊員",
			titles   	: ["消防隊員","小隊長","分隊長","中隊長","大隊長","副大隊長"],
			branch   	: member.branch || branch,
			workingTime : member.workingTime ||  1200,
			radioCode 	: member.radioCode ||  null, 
			mission  	: "瞄子手",
			missions 	: ["瞄子手","副瞄子手","司機","小組長","安全管制員","聯絡官",],
			corps	 	: UserSvc.userCorps(),
			corpss 	 	: ["第一救災救護大隊","第三救災救護大隊"],
		};

		BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
			vm.branches = branches; 
			if (!vm.isNew) {
				var branchArry = [];
				for (var i = branches.length - 1; i >= 0; i--) {
					branchArry.push(branches[i].name);
				};
				vm.member.branches = branchArry;
			}; 
		});

		var radioCodePrefix = function(branch){
			var suffix =  branch.split('').slice(-2).join('');
			if (suffix == "大隊" || suffix == "中隊") {
				return "北海";
			} else{
				return branch.split('').slice(0,2).join('');
			};
		};

		function save(){
			if (vm.member.name) {
				vm.member.radioCodePrefix = radioCodePrefix(vm.member.branch);
				MemberSvc.create(vm.member).success(function(){
					vm.member.workingTime = moment.duration(parseInt(vm.member.workingTime),'seconds');
				}).then(function(){
					$modalInstance.close(vm.member);
				})
			} else{

			};
		};

		function update(){
			var updateMember = {
				  memberId  : member.memberId,
				  id 		: "",
				  name 		: vm.member.name,
				  corps 	: vm.member.corps,
				  branch 	: vm.member.branch,
				  title 	: vm.member.title,
				  workingTime : vm.member.workingTime,
				  radioCode  : vm.member.radioCode,
				  radioCodePrefix : radioCodePrefix(vm.member.branch)
			}

			if (vm.member.name) {
				MemberSvc.updateByMemberId(updateMember);
				$modalInstance.close(updateMember);
			} else {
				
			};
		};
	
		function cancel(){
			$modalInstance.dismiss('cancel');
		};
	};
})();