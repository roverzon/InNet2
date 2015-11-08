(function(){
	'use strict';

	angular
		.module('app.case')
		.controller('CaseController',CaseController);
	
	CaseController.$inject = ['$stateParams','$modal','CaseSvc', '$log', 'SocketSvc', 'UserSvc', '$location'];
	function CaseController($stateParams,$modal,CaseSvc, $log, SocketSvc, UserSvc, $location){
		var vm = this; 
		vm.maxSize 		= 5; 
		vm.itemsPerPage = 3;
		vm.currentPage  = 1;
		vm.pageChanged  = pageChanged;
		vm.queryCases   = queryCases;
		vm.choose 		= choose;
		
		vm.queryCases();

		function pageChanged(){
			CaseSvc.fetch(UserSvc.userCorps(), vm.currentPage , vm.itemsPerPage ).success(function(data){
				vm.cases = data.cases;
			});
		};

		function queryCases(){
			CaseSvc.fetch(UserSvc.userCorps(), vm.currentPage, vm.itemsPerPage).success(function(data){
				vm.cases = data.cases;
				vm.totalItems = data.totalCases;
			});
		};

		function choose(id){
			CaseSvc.fetchById(vm.cases[id]._id).success(function(_case){
					vm.caseDetails = _case;
			});
		};

		SocketSvc.on('newCase',function(_case){
			vm.cases.unshift(_case);
		});

		SocketSvc.on('caseModified',function(_case){
			vm.cases[_case.caseId-1] = _case;
		});
	};

})();