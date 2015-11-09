(function(){
	'use strict';

	/**
	* app.safety Module
	*
	* Description
	*/
	angular
		.module('app.safety')
		.controller('SafetyCmdShowController',SafetyCmdShowController);

	SafetyCmdShowController.$inject = ['CaseSvc', 'BranchSvc', 'UserSvc', '$stateParams', 'GeoSvc'];
	
	function SafetyCmdShowController(CaseSvc, BranchSvc, UserSvc, $stateParams, GeoSvc){
		
		var vm = this; 
		var branch = UserSvc.userBranch();
	
		BranchSvc.totalListFindByName(branch).success(function(branch){
			vm.members = branch.members.filter(function(member) {
				member.limitTime = moment.duration(member.workingTime, 'seconds');
				return member.onDuty == true 
			});
		});

		CaseSvc.fetchDetails($stateParams.caseId).success(function(_case){
			vm.caseDetail = _case;
			vm.onDutyBranches = _case.branchIds;
			if (_case.location) {
				var location = JSON.parse(_case.location);
				vm.markers.mainMarker = {
					lat : Number(location.lat),
					lng : Number(location.lng),
					message : "案件標的"
				};

				vm.battleRadiuss = _case.battleRadiuss;
			};
		}).then(function(){
			vm.onDutyBranches.forEach(function(branch){
				branch.members.forEach(function(member){
					if (branch.director == member.name ) {
						branch.directorRadioCode = member.radioCodePrefix +  String(member.radioCode);
					};
					if (branch.safetyManager == member.name) {
						branch.safetyManagerRadioCode = member.radioCodePrefix + String(member.radioCode);
					};
				});

				if (vm.battleRadius) {
					vm.battleRadiuss.forEach(function(battleRadius){
						var radius = JSON.parse(battleRadius)
						if (branch.name == radius.base) {
							branch.estimatedArrivingTime =  Math.round(( radius.d / 50 ) * 60);
						};
					})		
				};
			});
		});

       GeoSvc.getGeolocationCoordinates().then(function(coord){
	        vm.nowPos.lat = coord.latitude;
	        vm.nowPos.lng = coord.longitude;
	        vm.nowPos.zoom = 17;
	        vm.markers.nowPos = {
	        	lat : vm.nowPos.lat,
	        	lng : vm.nowPos.lng,
	        	message : "現在位置"
	        }
	    });

	    angular.extend(vm, {
	        nowPos: {
	            lat: 24.988,
	            lng: 121.5752,
	            zoom: 13
	        },
	        markers: {},
	    });		
	};
})();