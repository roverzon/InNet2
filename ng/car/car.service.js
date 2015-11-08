(function(){
	'use strict';

	/**
	* app.car Module
	*
	* Description
	*/
	angular
		.module('app.car')
		.serice('CarSvc',CarSvc);

	CarSvc.$inject = ['$http'];
	
	function CarSvc($http){
		var vm = this; 
		vm.fetchByCorps  = fetchByCorps;
		vm.fetchByBranch = fetchByBranch;
		vm.update 		 = update; 

		function fetchByCorps(corps){
			return $http.get('/api/cars?corps=' + corps);
		};

		function fetchByBranch( branch ){
			return $http.get('/api/cars?branch=' + branch );
		};
		
		function update(data){
			return $http.put('/api/cars/' + data.id , data);
		};
	};
})();