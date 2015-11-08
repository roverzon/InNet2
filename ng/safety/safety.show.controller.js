(function(){
	'use strict';
	/**
	* app.safety Module
	*
	* Description
	*/
	angular
		.module('app.safety')
		.controller('SafetyShowController',SafetyShowController);

	SafetyShowController.$inject = ['CaseSvc', 'UserSvc', 'SocketSvc','GeoSvc', 'BranchSvc', '$stateParams'];

	function SafetyShowController(){
		var vm = this; 
		var branch = UserSvc.userBranch();
		
		BranchSvc.fetchByName(branch).success(function(branch){
			vm.members = branch.members.filter(function(member) {
				member.limitTime = moment.duration(member.workingTime, 'seconds');
				return member.onDuty == true 
			});
		});

		CaseSvc.fetchDetails($stateParams.caseId).success(function(_case){
			vm.caseDetail = _case;
			if (_case.location) {
				var location = JSON.parse(_case.location);
				vm.markers.mainMarker = {
					lat : Number(location.lat),
					lng : Number(location.lng),
					message : "案件標的"
				};
			};
		});

       GeoSvc.getGeolocationCoordinates().then(function(coord){
	        vm.nowPos.lat = coord.latitude;
	        vm.nowPos.lng = coord.longitude;
	        vm.nowPos.zoom = 17;
	        vm.markers.nowPos ={
	        	lat : vm.nowPos.lat,
	        	lng : vm.nowPos.lng,
	        	message : "現在位置"
	        }
	    })

	    angular.extend(vm, {
	        nowPos: {
	            lat: 24.988,
	            lng: 121.5752,
	            zoom: 13
	        },
	        markers: {},
	    });		
	}
})();