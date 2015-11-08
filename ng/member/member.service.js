(function(){
	'use strict';
	/**
	* app.member Module
	*
	* Description
	*/
	angular
		.module('app.member')
		.service('MemberSvc',MemberSvc)
	
	MemberSvc.$inject = ['$http'];
	
	function MemberSvc(){
		var svc = this; 
		svc.fetch = fetch;
		svc.findByBranch = findByBranch;
		svc.fetchOnDuty = fetchOnDuty;
		svc.create = create; 
		svc.update = update; 
		svc.updateOnDuty = updateOnDuty;
		svc.updateByMemberId = updateByMemberId;
		svc.updateIsChecked = updateIsChecked;
		svc.updateUser = updateUser;
		svc.removeUser = removeUser;
		svc.deleteMember = deleteMember;

		function fetch(){
			return $http.get('/api/members');
		};

		function findByBranch( branch ){
			return $http.get('/api/members/' + branch );
		};

		function fetchOnDuty(branch){
			return $http.get('/api/members/onDuty?branch=' + branch);
		};

		function create(member){
			return $http.post('/api/members/', member);
		};

		function update(member){
			return $http.put('/api/members/', member.id);
		};

		function updateOnDuty(member){
			return $http.put('/api/members/onDuty/findById?memberId=' + member.memberId, member);
		};

		function updateByMemberId(updateMember){
			return $http.put('/api/members/findById/' + updateMember.memberId , updateMember);
		}
		
		function updateIsChecked(memberData){
			return $http.put('/api/members?id=' + memberData.memberId, memberData)
		};
		
		function updateUser(username){
			return $http.put('/api/members/user?username='+ username);
		};
		
		function removeUser(username){
			return $http.put('/api/members/user/remove?username=' + username);
		};

		function deleteMember(member){
			return $http.delete('/api/members/' + member._id);
		};
	}
})();