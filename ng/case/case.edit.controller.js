(function(){
	'use strict';
	/**
	* app.case Module
	*
	* Description
	*/
	angular
		.module('app.case')
		.controller('CaseEditController',CaseEditController);

	CaseEditController.$inject = ['$stateParams', 'CaseSvc', 'CarSvc', 'UserSvc', 'BranchSvc', '$window', '$modal','NtfSvc'];

	function CaseEditController($stateParams, CaseSvc, CarSvc, UserSvc, BranchSvc, $window, $modal,NtfSvc){
		var vm = this; 
		var dispatchCars  = [];
		vm.terminateCase  = terminateCase;
		vm.dispatch 	  = dispatch;
		vm.selectBranch   = selectBranch;
		vm.cancelDispatch = cancelDispatch;
		vm.save 		  = save; 

		angular.extend(vm, {
	        nowPos: {
	            lat: 24.988,
	            lng: 121.5752,
	            zoom: 17
	        },
	        controls: {
	            draw: {}
	        }
	    });

		var caseId = $stateParams.id;

		BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
		    vm.branches = branches;
		    vm.currentBranch = branches[0].name
		});

		function selectBranch(branch){
	    	vm.currentBranch = branch.name;
	    };

		BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
		    vm.branches = branches;
		    vm.currentBranch = branches[0].name
		})

		CaseSvc.fetchById(caseId).success(function(_case){
			vm.currentCase = _case;
			vm.dispatchList = _.pluck(_case.cars, 'radioCode').join(' ')
			vm.currentCase.carIds = _.pluck(_case.cars,'_id');
		}).then(function(){
			CarSvc.fetchByCorps(UserSvc.userCorps()).success(function(cars){
				vm.cars = cars
				for (var i = 0; i < vm.cars.length; i++) {
					if ( vm.currentCase.carIds.indexOf(vm.cars[i]._id) > -1 ) {
						vm.cars[i].isChecked = true;
						dispatchCars.push(vm.cars[i]);
					};
				};
			});

			NtfSvc.fetch().success(function(ntfs){
				vm.ntfs = ntfs;
				vm.currentCase.ntfs = _.pluck(ntfs,'type')
				vm.currentCase.ntf  = vm.currentCase.ntfs[0];
			});
		});

		function getBranchId(branchesList){
			var branches = _.unique(branchesList);
			var branchIds = [];
			for (var i = 0; i < vm.branches.length; i++) {
				if (branches.indexOf(vm.branches[i].name) > -1) {
					branchIds.push(vm.branches[i]._id);
				};
			};
			return  branchIds;
		};

		function dispatch( car ){
			car.isChecked = true; 
			dispatchCars.push(car);
			vm.dispatchList = _.pluck(dispatchCars, 'radioCode').join(" ")
		};

		function cancelDispatch(car){
			car.isChecked = false;
			dispatchCars.splice(_.pluck(dispatchCars, '_id').indexOf(car._id),1)
			vm.dispatchList = _.pluck(dispatchCars, 'radioCode').join(" ")
		};

		function save(){
			var currentNtf;

			vm.ntfs.forEach(function(ntf,id){
				if (ntf.type == vm.currentCase.ntf ) {
					currentNtf  = vm.ntfs[id];
				};
			});
			CaseSvc.update({
				caseId    : vm.currentCase._id,
				address   : vm.currentCase.address || "測試",
				officerReceiver : UserSvc.currentUser() ||  "劉曉曼",
				type      : vm.currentCase.type || "火警",
				types 	  : vm.currentCase.types,
				phone     : vm.currentCase.phone || "測試",
				branches  : _.unique(_.pluck(dispatchCars, 'branch')),
				branchIds : getBranchId(vm.currentCase.branches),
		  		cars      : _.pluck(dispatchCars,'_id'),
				isOngoing : true,
				corps 	  : UserSvc.userCorps(),
				env 	  : vm.currentCase.env,
				envs 	  : vm.currentCase.envs,
				floor 	  : vm.currentCase.floor,
				ntf       : currentNtf._id,
				lastUpdate : moment().format('YYYY-MMM-DD h:mm:ss a')
			}).success(function(){
				$window.history.back();
			})
		};

		function terminateCase (){
			var modalInstance = $modal.open({
			  	templateUrl: 'views/case/case.confirm.modal.html',
			    controller: 'CaseConfirmCtrl',
			    size: "md"	    
			});
		};
	}
})();