(function(){
	'use strict';
	/**
	* app.case Module
	*
	* Description
	*/
	angular
		.module('app.case')
		.controller('CaseNewController',CaseNewController);

	CaseNewController.$inject = ['CarSvc', 'BranchSvc', 'NtfSvc', 'UserSvc','$location','leafletData', '$stateParams', 'CaseSvc', '$window', '$state', 'GeoSvc'];

	function CaseNewController(CarSvc, BranchSvc, NtfSvc, UserSvc,$location,leafletData, $stateParams, CaseSvc, $window, $state, GeoSvc){
		var vm = this;
		vm.selectBranch = selectBranch;
		vm.save = save;
		vm.locateAddress = locateAddress;
		vm.cancelDispatch = cancelDispatch;
		vm.dispatch = dispatch;
		vm.currentTime =  moment().format('h:mm:ss a'); 
		var battleRadiuss = [];
		var dispatchCars = [];
		var notifications;
		vm.dispatchList = vm.currentCase.dispatchList.join(' ');
		
		vm.currentCase = {
			phone 	: null,
		    type 	: '火警', 
		    types 	: [ '火警', '救護', '災害', '檢舉','其他'],
		    env   	: '住宅火警',
		    envs  	: ['住宅火警','高樓、地下與工廠','搶救困難區','其他'],
		    floor 	: 1, 
		    carIds  : [],
		    dispatchList : [],
		    branches :  [],
		    location : GeoSvc.defaultLocation()
		}; 

		GeoSvc.fetchBaseLocation(UserSvc.userCorps()).success(function(locations){
			vm.locations = locations;
		});

	    angular.extend(vm, {
	        nowPos: {
	            lat: GeoSvc.defaultLocation().lat,
	            lng: GeoSvc.defaultLocation().lng,
	            zoom: 17
	        },
	       markers: {},
	    });

		BranchSvc.fetchByCorps(UserSvc.userCorps()).success(function(branches){
		    vm.branches = branches;
		    vm.currentBranch = branches[0].name
		});

		CarSvc.fetchByCorps(UserSvc.userCorps()).success(function(cars){
			vm.cars = cars; 
		});

		NtfSvc.fetch().success(function(ntfs){
			notifications = ntfs;
			vm.currentCase.ntfs = _.pluck(ntfs,'type')
			vm.currentCase.ntf  = vm.currentCase.ntfs[0];
		});

		function locateAddress(){
			if (vm.currentCase.address) {
				GeoSvc.getGeoEncodedInfo(vm.currentCase.address).then(function(res){
			        vm.nowPos.lat = res.J;
			        vm.nowPos.lng = res.M;
		            vm.markers.mainMarker = {
		            	lat: res.J,
		                lng: res.M,
		                focus: true,
		                message: "案件標的",
		            };

		            if (res) {
		            	vm.locations.forEach(function(location){
			            	var r = GeoSvc.getDistance( location, { lat : res.J , lng : res.M } );
			            	var battleRadius =  { base : location.branch,  to : { lat : res.J, lng :  res.M }, from : { lat : location.lat, lng : location.lng }, d : r }; 
			            	battleRadiuss.push( JSON.stringify(battleRadius));
			            });
		            };
				});
			};
		};

		function selectBranch(branch){
	    	vm.currentBranch = branch.name;
	    };

		function dispatch( car ){
			car.isChecked = true; 
			dispatchCars.push(car);
			vm.dispatchList = _.pluck(dispatchCars, 'radioCode').join(" ");
		};

		function cancelDispatch(car){
			car.isChecked = false;
			dispatchCars.splice(_.pluck(dispatchCars, '_id').indexOf(car._id),1);
			vm.dispatchList = _.pluck(dispatchCars, 'radioCode').join(" ");
			vm.dispatchList = vm.currentCase.dispatchList.join(" ");
		};
	
		function save(){
			var currentNtf;
			var branches  = _.unique(_.pluck(dispatchCars, 'branch'));
			var dispatch = vm.branches.filter(function(branch) { return branches.indexOf(branch.name) > -1 });

			notifications.forEach(function(ntf,id){
				if (ntf.type == vm.currentCase.ntf ){
					currentNtf  = notifications[id]
				};
			});

			CaseSvc.create({
				officerReceiver : UserSvc.currentUser() ||  '劉曉曼',
				type      		: vm.currentCase.type || '火警',
				types 	  		: vm.currentCase.types,
				phone     		: vm.currentCase.phone || '測試',
				branches  		: _.unique(_.pluck(dispatchCars, 'branch')),
				branchIds 		: _.pluck(dispatch, '_id'),
		  		cars      		: _.pluck(dispatchCars,'_id'),
				corps 	  		: UserSvc.userCorps(),
				env 	  		: vm.currentCase.env,
				envs 	  		: vm.currentCase.envs,
				floor 	  		: vm.currentCase.floor,
				ntf       		: currentNtf._id,
				createAt  		: moment().format('YYYY-MMM-DD, h:mm:ss a'),
				lastUpdate 		: moment().format('YYYY-MMM-DD, h:mm:ss a'),
				location  		:  {
					lat 	: vm.currentCase.location.lat,
					lng 	: vm.currentCase.location.lng,
					address : vm.currentCase.location.address || '測試'
				},
				battleRadiuss 	: battleRadiuss
			}).success(function(){
				$window.history.back();
			});
		};
	}
})();