(function(){
	'use strict';

	/**
	* app.member Module
	*
	* Description
	*/
	angular
		.module('app.member')
		.controller('MemberEditController',MemberEditController);
	
	MemberEditController.$inject = ['MemberSvc', 'BranchSvc', '$stateParams', '$window','$modal', '$state', 'UserSvc'];
	
	function MemberEditController( MemberSvc, BranchSvc, $stateParams, $window,$modal, $state, UserSvc){
		var vm = this; 

		vm.alerts = [];
		vm.memberDeleted = false;
		var tempDelMember = null;
		vm.accessLevel = UserSvc.accessLevel();
		vm.closeAlert = closeAlert;
		vm.save = save;
		vm.addNewMember = addNewMember;
		vm.update = update;
		vm.activateAccount = activateAccount;
		vm.deleteAlert = deleteAlert;
		vm.deActivateAlert = deActivateAlert;
		
		var memberInit = function(){
			MemberSvc.findByBranch($stateParams.branch).success(function(members){
				vm.members = members;
				vm.members.forEach(function(member){
					member.workingTime = moment.duration(member.workingTime,'seconds');
				});
			});
		};

		memberInit();

		var deActivateAccount = function(index){
			UserSvc.removeUser(tempDelMember.name).success(function(user){
				MemberSvc.removeUser(user.username);
				vm.closeAlert(index);
				memberInit();
			});
		};

		var deleteMember = function(index){
			vm.memberDeleted = true;
			MemberSvc.deleteMember(tempDelMember).success(function(){
				vm.memberDeleted = false;
			});
			vm.closeAlert(index);
			memberInit();
		};

		var cancelDel = function(index){
			vm.memberDeleted = false;
			vm.closeAlert(index);
		};

		function save(){
			var directors = _.pluck( vm.members.filter(function(member) { return member.level > 1.3  }) , 'name');
			BranchSvc.update({
				branch : $stateParams.branch,
				members : _.pluck( vm.members , '_id'),
				directors : directors,
				director : directors[0],
				safetyManager : directors[0]
			}).success(function(){
				$window.history.back();
			});		
		};

		function addNewMember(){
			var modalInstance = $modal.open({
			    templateUrl: 'views/member/member.modal.html',
			    controller: 'MemberModalCtrl',
			    size: "md",
			    resolve : {
			    	branch : function(){
			    		return $stateParams.branch 
			    	},
			    	member : function(){
			    		return { workingTime : null };
			    	}
			    }
		    });

		    modalInstance.result.then(function(member){
		    	if (member) {
		    		memberInit();
		    	}
		    	vm.alerts.push({ type : "success" ,  msg: '人員新增成功！ ' + member.name + ' 已加入 ' + member.branch});
		    })
		};

		function update(member){
			var oldMember = member;
			var modalInstance = $modal.open({
			    templateUrl: 'views/member/member.modal.html',
			    controller: 'MemberModalCtrl',
			    size: "md",
			    resolve : {
			    	branch : function(){
			    		return $stateParams.branch 
			    	},
			    	member : function(){
			    		return {
			    			memberId : member._id,
			    			id : member.id,
			    			name : member.name,
			    			title : member.title,
			    			branches : member.branches,
			    			corps : member.corps,
			    			radioCode : member.radioCode, 
			    			workingTime : member.workingTime.minutes() * 60 + member.workingTime.seconds()
			    		}
			    	}
			    }
		    });

		    modalInstance.result.then(function(member){
		    	memberInit();
		    	vm.alerts.push({ type : "info" ,  msg:  oldMember.name + '修改成功!' });
		    });
		};

		function activateAccount(member){
			var users = vm.members.filter(function(member) {
				return member.isUser;
			});

			if (users.length < 3 ) {
				var modalInstance = $modal.open({
				    templateUrl: 'views/member/member.account.html',
				    controller: 'MemberAccountModalCtrl',
				    size: "md",
				    resolve : {
				    	member : function(){
				    		return member
				    	}
				    }
				});

				modalInstance.result.then(function(member){
					memberInit();
					vm.alerts.push({ type : "info" , msg : member.name + " 已開通為使用者" })
				});
			} else {
				vm.alerts.push({ type : "warning" , msg : "無法開通" + member.name + " 因為使用者已超過3位，請解除其他人帳號後再開通 "});
			};
		};

		function deleteAlert(member){
			vm.alerts.push({ 	
				type : "danger" ,  
				msg: '是否確定要刪除！' + member.name, 
				execute : deleteMember,
				cancel :  cancelDel
			});
			tempDelMember = member;
		};

		function deActivateAlert(member){
			var users = vm.members.filter(function(member) {
				return member.isUser;
			});
			if (users.length == 1 ) {
				vm.alerts.push({ 
					type : "warning",  
					msg: '每分隊至少要有1個使用者，無法取消' + member.name + "的登入權限",
				});
			} else{
				vm.alerts.push({ 
					type : "danger",  
					msg: '是否確定要解除' + member.name + "登入權限",
					execute : deActivateAccount,
					cancel : cancelDel
				});
				tempDelMember = member;
			};
		};
	
		function closeAlert(index){
			vm.alerts.splice(index,1)
		};
	}
})();