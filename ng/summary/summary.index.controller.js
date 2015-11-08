(function(){
	'use strict';
	/**
	* app.summary Module
	*
	* Description
	*/
	angular
		.module('app.summary')
		.controller('SummaryController',SummaryController);

	SummaryController.$inject = ['StSvc', '$stateParams', '$interval', '$state', 'SocketSvc', 'CaseSvc'];
	function SummaryController(){
		var vm = this; 
		vm.isCollapsed = true ;
		vm.members = [];

		SocketSvc.on('timerRunning',function(st){
			for (var i = vm.strikeTeams.length - 1; i >= 0; i--) {
				if( angular.equals(vm.strikeTeams[i]._id, st.stId)){
					return vm.strikeTeams[i].timerRunning = st.timerRunning;
				}
			};
		})

		SocketSvc.on('progressUpdate',function(data){
			for (var i = vm.strikeTeams.length - 1; i >= 0; i--) {
				if( angular.equals(vm.strikeTeams[i]._id, data.id) ){
					vm.strikeTeams[i].timer	= moment.duration(data.millis); 
					vm.strikeTeams[i].progress  = data.progress;
					vm.strikeTeams[i].progressState =  data.progressState;
				}
			};
		})

		SocketSvc.on('newSt', function(st){
			if ( angular.equals(caseId,st.caseId)) {
				var newSt = angular.copy(st);
				return vm.strikeTeams.push(newSt);
			};
			vm.deploys = initTable(vm.strikeTeams);
		});

		

		SocketSvc.on('updateSt', function(data){
			StSvc.fetchByCase(caseId).success(function(strikeTeams){
				vm.strikeTeams = strikeTeams;
				vm.strikeTeams.forEach(function(st){
					st.limitTime = moment.duration(st.workingTime,'seconds');
				});
				vm.deploys = initTable(vm.strikeTeams);
			});

		})

		SocketSvc.on('dismiss', function(data){
			StSvc.fetchByCase(caseId).success(function(strikeTeams){
				vm.strikeTeams = strikeTeams;
				vm.deploys = initTable(vm.strikeTeams);
			});
		});


		var caseId = $stateParams.caseId;
		CaseSvc.fetchById(caseId).success(function(_case){
			_case.env == '住宅火警' ? vm.apartment = true : vm.apartment = false;
			vm.caseDetail = _case;
			vm.position = {
				defaultPos 	: "第一面",
				positions 	: ["第一面","第二面","第三面","第四面"],
				floor 		: vm.caseDetail.floor,
				floors  	: vm.caseDetail.floor < 5? _.range(1,6,1) : _.range(vm.caseDetail.floor-2,vm.caseDetail.floor+3,1)
			};
		})

		StSvc.fetchByCase(caseId).success(function(strikeTeams){
			if (strikeTeams) {
				vm.strikeTeams = strikeTeams;
				vm.strikeTeams.forEach(function(st){
					st.limitTime = moment.duration(st.workingTime,'seconds');
				});
				vm.deploys = initTable(vm.strikeTeams);
			} else {
				return 
			};
		});



		var initTable =  function(strikeTeams){
		  	var deployArray = _.range(4).map(function () {
		        return _.range(5).map(function () {
		            return { totalMember : 0, stTotal : 0 , sts : [] } ;
		        });
		    });

			if ( strikeTeams ){
				for (var i = strikeTeams.length - 1; i >= 0; i--) {
					var totalMember = 0;
					var y = null;
					var st = 0;
					var x = _.indexOf(strikeTeams[i].positions, strikeTeams[i].position);
					vm.apartment ? y = _.indexOf(strikeTeams[i].floors, strikeTeams[i].floor) : y = _.indexOf(strikeTeams[i].areas, strikeTeams[i].area)
					deployArray[x][y].stTotal += 1;
					deployArray[x][y].totalMember += strikeTeams[i].members.length;
					var stInFo = {};
					stInFo.id = strikeTeams[i].branch + strikeTeams[i].id
					stInFo.number = strikeTeams[i].members.length;
					stInFo.group = strikeTeams[i].group;
					deployArray[x][y].sts.push(stInFo);
				};
			}
			return deployArray
		};
		
		vm.$on('$destroy', function (event) {
	        SocketSvc.removeAllListeners();
	    });
	};
})();