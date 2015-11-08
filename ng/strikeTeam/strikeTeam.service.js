(function(){
	'use strict';
	/**
	* app.strikTeam Module
	*
	* Description
	*/
	angular
		.module('app.strikTeam')
		.serivce('StSvc',StSvc);
		
	StSvc.$inject = ['$http'];

	function StSvc(){
		var svc = this; 
		svc.fetch = fetch;
		svc.fetchByCase = fetchByCase;
		svc.findById = findById;
		svc.dismissSt = dismissSt;
		svc.updateSt = updateSt;
		svc.updateTimeRecord = updateTimeRecord;
		svc.create = create;
		svc.count = count; 

		function fetch(caseId, branch){
			return $http.get('/api/strikeTeams?caseId=' + caseId + '&branch=' + branch);
		};
	
		function fetchByCase(caseId){
			return $http.get('/api/strikeTeams/total?caseId=' + caseId);
		};
		
		function findById(caseId){
			return $http.get('/api/strikeTeams/' + caseId);
		};

		function dismissSt(data){
			return $http.put('/api/strikeTeams/dismiss?id=' + data.id);
		};

		function updateSt(data){
			return $http.put('/api/strikeTeams/update?id=' + data.id, data);
		};

		function updateTimeRecord(data){
			return $http.put('/api/strikeTeams/time?id=' + data.id, data);
		};

		function create(strikeTeam){
			return $http.post('/api/strikeTeams', strikeTeam);
		};
		
		function count(caseId){
			return $http.get('/api/strikeTeams/count?caseId=' + caseId);
		};
	}

})();