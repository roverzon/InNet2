(function(){
	'use strict';

	/**
	* app.timer Module
	*
	* Description
	*/
	angular
		.module('app.timer')
		.controller('TimerController',TimerController);

	TimerController.$inject = ['SocketSvc'];

	function TimerController(){
		var vm = this; 
		vm.timerRunning = false;
		vm.startTimer = startTimer;
		vm.stopTimer = stopTimer;
	    
	    function startTimer(st, id){
	    	vm.$broadcast('timer-start');
	    	vm.timerRunning = true;
	        SocketSvc.emit('timer', { stId : st._id, timerRunning : true } )
	    };
	    
	    function stopTimer(st,id){
	    	vm.$broadcast('timer-stop');
	    	vm.timerRunning = false;
	        SocketSvc.emit('timer', { stId : st._id, timerRunning : false } )
	    };
	};

})();