(function(){
	'use strict';
	/**
	* app.notification Module
	*
	* Description
	*/
	angular
		.module('app.notification')
		.service('NtfSvc',NtfSvc);

	NtfSvc.$inject = ['$http'];
	
	function NtfSvc($http){
		var svc = this;
		svc.fetch = fetch; 
		function fetch(){
			return $http.get('/api/ntfs');
		} ;
	};

})();