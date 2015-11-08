(function(){

	/**
	* app.branch Module
	*
	* Description
	*/
	angular
		.module('app.branch')
		.controller('BranchSvc',BranchSvc);

	BranchSvc.$inject = ['$http'];
	function BranchSvc($http){
		var svc = this;
		svc.fetchByCorps 	= fetchByCorps;
		svc.fetchByName 	= fetchByName;
		svc.totalListFindByName = totalListFindByName;
		svc.getDetails 		= getDetails;
		svc.fetchOnDutyBranches = fetchOnDutyBranches;
		svc.update 			= update;
		svc.updateMission 	= updateMission;
		
		function fetchByCorps(corps){
			return $http.get('/api/branches?corps=' + corps);
		};
		
		function fetchByName(branch){
			return $http.get('/api/branches?branch=' + branch);
		};

		function totalListFindByName(branch){
			return $http.get('/api/branches/' + branch)
		}

		function getDetails(id){
			return $http.get('/api/branches/' + id);
		};

		function fetchOnDutyBranches(branches){
			return $http.post('/api/branches/onduty',branches);
		};
	
		function update(data){
			return $http.put('/api/branches/' + data.branch , data);
		};

		function updateMission(data){
			return $http.put('/api/branches?branch=' + data.branch, data);
		};
	};

})();