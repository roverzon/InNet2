(function(){
	'use strict';
	/**
	* app.case Module
	*
	* Description
	*/
	angular
		.module('app.case')
		.controller('CaseModalController',CaseModalController);

	CaseModalController.$inject = ['CarSvc', '$modalInstance', 'CaseSvc','$state', 'caseId','caseDetails', 'StSvc', '$window', 'BranchSvc', 'UserSvc', 'NtfSvc'];

	function CaseModalController(CarSvc, $modalInstance, CaseSvc,$state, caseId,caseDetails, StSvc, $window, BranchSvc, UserSvc, NtfSvc){
		var vm = this; 
		vm.nftOption = {};
		vm.dispatchList = vm.caseObj.dispatchList.join(" ");
		vm.caseObj = {
			address : caseDetails.address || null,
			phone : caseDetails.phone || null,
		    type : caseDetails.type ||  "火警", 
		    types : [ "火警", "救護", "災害", "檢舉","其他"],
		    env   : "住宅火警",
		    envs  : ["住宅火警","高樓、地下與工廠","搶救困難區","其他"],
		    floor : 1, 
		    carIds : getCarsDetail(caseDetails).carIds  || [],
		    dispatchList : getCarsDetail(caseDetails).dispatchList ||  [],
		    branches : getCarsDetail(caseDetails).branches ||  []
		};
		vm.update 	 = update;
		vm.getCars 	 = getCars;
		vm.cancel 	 = cancel;
		vm.cancelDispatch = cancelDispatch;
		vm.dispatch  = dispatch;
		vm.closeCase = closeCase;
		vm.save 	 = save;

		if (_.isEmpty(caseDetails)) {
			vm.isNew = true;
			carObjs = [];
		}else{
			vm.isNew = false;
			var carObjs = caseDetails.cars;
		};

		NtfSvc.fetch().success(function(nfts){
			vm.nftOption.nfts = nfts;
		}).then(function(){
			vm.nftOption.nft = vm.nftOption.nfts[0];
		})

		BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
		    vm.branches = branches;
		});

		function getCarsDetail(obj){
			var dispatchList = [];
			var carIds = [];
			var branches = [];

			if (obj.cars) {
				for (var i = obj.cars.length - 1; i >= 0; i--) {
					dispatchList.push(obj.cars[i].radioCode);
					carIds.push(obj.cars[i]._id);
					branches.push(obj.cars[i].branch); 
				};
				return {dispatchList : dispatchList , carIds : carIds , branches :  branches}

			}else{
				return {};
			};
		};

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
		
		function getCars( branch ){
			 CarSvc.fetchByBranch(branch.name).success(function(cars){
			 	for (var i = cars.length - 1; i >= 0; i--) {
			 		if (vm.caseObj.carIds.indexOf(cars[i]._id) > -1 ) {
			 			cars[i].isChecked = true; 
			 		};
			 	};
			 	vm.cars = cars;
			 });
		};

		function cancel() {
			$modalInstance.dismiss('cancel');
		};

		function cancelDispatch(car){
			car.isChecked = false;
			carObjs.splice(carObjs.indexOf(car),1)
			vm.caseObj.carIds.splice(vm.caseObj.dispatchList.indexOf(car._id),1);
			vm.caseObj.dispatchList.splice(vm.caseObj.dispatchList.indexOf(car.radioCode),1);
			vm.caseObj.branches.splice(vm.caseObj.dispatchList.indexOf(car.branch),1);
			vm.dispatchList = vm.caseObj.dispatchList.join(" ");
		};
		
		function dispatch( car ){
			car.isChecked = true; 
			carObjs.push(car);
			vm.caseObj.carIds.push(car._id);
			vm.caseObj.dispatchList.push(car.radioCode);
			vm.caseObj.branches.push(car.branch);
			vm.dispatchList = vm.caseObj.dispatchList.join(" ");
		};

		function closeCase(){
			StSvc.count(caseDetails._id).success(function(total){
				if (total > 0 ) {
					$window.alert("尚有隊員在安全管制")
				}else{
					CaseSvc.closeCase({
						id : caseDetails._id,
						isOngoing : false
					}).success(function(msg){
						console.log(msg)
					});
					$modalInstance.dismiss('cancel');
					$state.reload()
				};
			});
		};

		function save(){
			CaseSvc.create({
				caseId   : caseId + 1, 
				address   : vm.caseObj.address || "測試",
				officerReceiver : UserSvc.currentUser() ||  "劉曉曼",
				type      : vm.caseObj.type || "救護",
				phone     : vm.caseObj.phone || "測試",
				branches  : _.unique(vm.caseObj.branches),
				branchIds : getBranchId(vm.caseObj.branches),
		  		cars      : vm.caseObj.carIds,
				isOngoing : true,
				corps 	  : UserSvc.userCorps(),
				env 	  : vm.caseObj.env,
				floor 	  : vm.caseObj.floor
			}).success(function(newCase){
				$modalInstance.close(newCase)
			});
		};

		function update(){
			var content = {
				id : caseDetails._id,
				caseId   : caseId, 
				address   : vm.caseObj.address,
				officerReceiver : UserSvc.currentUser() || "劉曉曼",
				type      : vm.caseObj.type,
				phone     : vm.caseObj.phone,
				branches  : _.unique(vm.caseObj.branches),
				branchIds : getBranchId(vm.caseObj.branches),
		  		cars      : vm.caseObj.carIds,
				isOngoing : true,
				env 	  : vm.caseObj.env,
				floor 	  : vm.caseObj.floor
			};
			
			CaseSvc.update(content);
			$modalInstance.dismiss('cancel');
		};
	}
})();