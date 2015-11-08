(function(){
	'use strict';
	/**
	* app.member Module
	*
	* Description
	*/
	angular
		.module('app.member')
		.controller('MemberAccountModalController',MemberAccountModalController);

	MemberAccountModalController.$inject = ['UserSvc', 'MemberSvc', 'member', '$modalInstance'];
	function MemberAccountModalController(UserSvc, MemberSvc, member, $modalInstance){
		var vm = this; 
		vm.user = member;
		vm.save = save;
		vm.cancel = cancel; 

		function save(){
			if (_.isEmpty(vm.user)) {
				console.log("please enter your account and password!")
			} else{
				if (!vm.user.account) {
					console.log("account can't be blank!")
					if (!vm.user.password) {
						console.log("passwod can't be blank!")
					};
				} else if (!vm.user.password) {
					console.log("password can't be blank")
				}else{
					UserSvc.activate(vm.user);
					MemberSvc.updateUser(member.name);
					$modalInstance.close(vm.user);
				};
			};
		};

		function cancel(){
			$modalInstance.dismiss('cancel');
		};
	};
})();