(function(){
	'use strict';
	/**
	* app.case Module
	*
	* Description
	*/
	angular
		.module('app.case')
		.service('CaseSvc', CaseSvc);

	CaseSvc.$inject = ['$http'];

	function CaseSvc( $http ) {
		var svc = this;
		svc.fetch 		= fetch;
		svc.fetchAll 	= fetchAll;
		svc.closeCase 	= closeCase;
		svc.fetchRelativeCase = fetchRelativeCase; 
		svc.fetchDetails = fetchDetails;
		svc.fetchById 	= fetchById;
		svc.create 		= create;
		svc.delete 		= deleteCase;
		svc.update 		= update;
		
		function fetch(corps, page, itemsPerPage){
			return $http.get('/api/cases?corps=' + corps + '&page=' + page + '&ipp=' + itemsPerPage );
		};

		function fetchAll(){
			return $http.get('/api/cases/details');
		};
		
		function fetchRelativeCase(con){
			return $http.get('/api/cases/branch?branch=' + con.branch + '&accessLevel=' + con.accessLevel + '&corps=' + con.corps );
		};
		
		function fetchDetails(caseId){
			return $http.get('/api/cases/details/' + caseId);
		};

		function fetchById( caseId ){
			return $http.get('/api/cases/' + caseId );
		};
		
		function create(case_info){
			return $http.post('/api/cases', case_info);
		};

		function deleteCase(caseId){
			return $http.post('/api/cases/' + caseId);
		};

		function update(updated_case){
			return $http.put('/api/cases/' + updated_case.caseId , updated_case);
		};
		
		function closeCase(data){
			return $http.put('/api/cases/close?id=' + data.id, data );
		};
	}
})();