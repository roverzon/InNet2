(function(){
	'use strict';

	/**
	* app.dispatch Module
	*
	* Description
	*/
	angular
		.module('app.dispatch', [])
		.controller('DispatchController',DispatchController);

	DispatchController.$inject = ['$stateParams','$modal','CaseSvc','BranchSvc', 'CarSvc', 'UserSvc'];
	function DispatchController($stateParams,$modal,CaseSvc,BranchSvc, CarSvc, UserSvc){
		var vm = this; 
		CaseSvc.fetch(UserSvc.userCorps()).success(function(cases){
			vm.cases = cases;
			CaseSvc.fetchById(vm.cases[$stateParams.caseId]._id).success(function(_case){
					return vm.caseDetails = _case;
			});
		});

		BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
		    return vm.branchList = branches;
		 });

		CarSvc.fetch().success(function(data){
		    return vm.carsData = data;
		});

		vm.addNewCase = function () {
		  	var modalInstance = $modal.open({
			    templateUrl: '/partials/casePanel/caseAddModal',
			    controller: 'CaseAddModalCtrl',
			    size: "lg",
			    resolve : {
			    	caseId : function(){
			    		return vm.id = "新增案件"
			    	},
			    	branchList : function(){
			    		return vm.branchList;
			    	},
			    	carsData : function(){
			    		return vm.carsData;
			    	},
			    	isNew : function(){
			    		return true;
			    	},
			    	caseDetails : function(){
			    		return {}
			    	}
			    }
		    });
		 };

		 vm.editCase = function(){
		 	var modalInstance = $modal.open({
			    templateUrl: '/partials/casePanel/caseAddModal',
			    controller: 'CaseAddModalCtrl',
			    size: "lg",
			    resolve : {
			    	caseId : function(){
			    		return vm.id = vm.cases[$stateParams.caseId].caseId; 
			    	},
			    	branchList : function(){
			    		return vm.branchList;
			    	},
			    	carsData : function(){
			    		for (var i = vm.carsData.length - 1; i >= 0; i--) {
			    			for (var j = vm.caseDetails.cars.length - 1; j >= 0; j--) {
			    				if ( vm.carsData[i].radioCode === vm.caseDetails.cars[j].radio_code) {
			    					return vm.carsData[i].isChecked = true ;
			    				};
			    			};		    			
			    		};
			    		return vm.carsData;
			    	},
			    	isNew : function(){
			    		return false; 
			    	},
			    	caseDetails : function(){
			    		return vm.caseDetails;
			    	}
			    }
		    });
		 };
	}
})();