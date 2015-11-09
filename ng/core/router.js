;(function(){
	'use strict';
	angular
		.module('app')
		.config(routerConfig);

		routerConfig.$inject = ['$stateProvider','$urlRouterProvider','$locationProvider'];
		
		function routerConfig($stateProvider,$urlRouterProvider, $locationProvider) {
		    $urlRouterProvider
    			.otherwise('/login');

		    $stateProvider
		        .state('anon',{
		            url : "",
		            abstract : true,
		            template : "<ui-view>",
		        })
		        .state('anon.login',{
		            url : "/login",
		            templateUrl :"login.html",
		            controller : "LoginController",
		            controllerAs : "LoginCtrl"
		        })
		        .state('anon.404',{
		            url : "/404",
		            templateUrl : "404.html"
		        })

    			// duty desk 
			$stateProvider
				.state('dutyDesk', {
		            abstract: true,
		            url: "/dutyDesk",
		            templateUrl: "views/common/content.html",
		            data : {
		                requiredLogin : true,
		                role : ["admin"]
		            }
		        })
		        .state('dutyDesk.corps', {
		            url: "/corps",
		            templateUrl: "views/dashboard/corps.dashboard.html",
		            controller : "DashboardController",
		            controllerAs : "DashboardCtrl",
		            data : {
		                requiredLogin : true,
		                role : ["admin"]
		            }
		        })
		        .state('dutyDesk.branch',{
		            url : "/branch",
		            templateUrl : "views/dashboard/branch.dashboard.html",
		            controller : "DashboardController",
		            controllerAs : "DashboardCtrl",
		            date : {
		                requiredLogin : true,
		                role : ["admin"]
		            }
		        })
		        .state('dutyDesk.case',{
		            abstract : true,
		            template : "<ui-view>"
		        })
		        .state('dutyDesk.case.index', {
		            url: "/case",
		            templateUrl: "case/case.index.html",
		            controller : "CaseController",
		            controllerAs : "CaseCtrl"
		        })
		        .state('dutyDesk.case.new',{
		            url : "/case/new",
		            templateUrl : "case/case.new.html",
		            controller : "CaseNewController",
		            controllerAs : "CaseNewCtrl"
		        })
		        .state('dutyDesk.case.show',{
		            url : "/case/:id/show",
		            templateUrl : "case/case.show.html",
		            controller : "CaseShowController",
		            controllerAs : "CaseShowCtrl"
		        })
		        .state('dutyDesk.case.edit',{
		            url : "/case/:id/edit",
		            templateUrl : "case/case.edit.html",
		            controller : "CaseEditController",
		            controllerAs : "CaseEditCtrl"
		        })
		        .state('dutyDesk.safety',{
		            url : "/case/:id",
		            templateUrl : "summary/summary.index.html",
		            controller : "SummaryController",
		            controllerAs : "SummaryCtrl"
		        })
		        .state('dutyDesk.dutylist',{
		            abstract : true,
		            template : "<ui-view>"
		        })
		        .state('dutyDesk.dutylist.index', {
		            url: "/dutylist/:branch",
		            templateUrl: "views/dutylist/dutylist.index.html",
		            controller : "DutyListController",
		            controllerAs : "DutyListCtrl"
		        })
		        .state('dutyDesk.dutylist.show',{
		        	url : "/dutylist/:branch/index",
		        	template : "<h2> show </h2>"
		        })
		        .state('dutyDesk.dutylist.edit', {
		            url: "/dutylist/:branch/edit",
		            templateUrl  : "views/dutylist/dutylist.edit.html",
		            controller   : "DutyListEditController",
		            controllerAs : "DutyListEditCtrl"
		        })
		        .state('dutyDesk.member',{
		            abstract : true,
		            template : "<ui-view>"
		        })
		        .state('dutyDesk.member.show', {
		            url: "/member/:branch",
		            templateUrl  : "views/member/member.index.html",
		            controller   : "MemberController",
		            controllerAs : "MemberCtrl"
		        })
		        .state('dutyDesk.member.edit', {
		            url: "/member/:branch/edit",
		            templateUrl  : "views/member/member.edit.html",
		            controller 	 : "MemberEditController",
		            controllerAs : "MemberEditCtrl"
		        });
			$stateProvider
		        .state('director',{
		            abstract : true,
		            url : "",
		            templateUrl : "views/director/director.content.html",
		            data : {
		                requiredLogin : true,
		                role : ["user"]
		            }
		        })
		        .state('director.safety',{
		            abstract : true,
		            url : "/safety",
		            template : "<ui-view>" 
		        })
		        .state('director.safety.index',{
		            url : "/index",
		            templateUrl : "views/safety/safety.index.html",
		            controller : "SafetyIndexController",
		            controllerAs : "SafetyIndexCtrl"
		        })
		        .state('director.safety.cmdShow',{
		            url : "/cmd/:caseId/show",
		            templateUrl : "views/safety/safety.cmd.show.html",
		            controller : "SafetyCmdShowController",
		            controllerAs : "SafetyCmdShowCtrl"
		        })
		        .state('director.safety.branchShow',{
		            url : "/:caseId/show",
		            templateUrl : "views/safety/safety.branch.show.html",
		            controller : "SafetyShowController",
		            controllerAs : "SafetyShowCtrl"
		        })
		        .state('director.safety.management',{
		            url : "/:caseId/manage",
		            templateUrl : "views/safety/safety.manage.html",
		            controller : "SafetyManageController",
		            controllerAs : "SafetyManageCtrl"         
		        })
		        .state('director.safety.summary',{
		            url : "/:caseId/summary",
		            templateUrl : "views/summary/summary.index.html",
		            controller : "SummaryController",
		            controllerAs : "SummaryCtrl"
		        })
		        .state('director.dutylist',{
		            abstract : true,
		            url : "/dutylist",
		            template : "<ui-view>" 
		        })
		        .state('director.dutylist.index',{
		            url : "/index",
		            templateUrl: "views/dutylist/director.dutylist.index.html",
		            controller : "DirDutyListController",
		            controllerAs : "DirDutyListCtrl"
		        })
		        .state('director.dutylist.edit',{
		            url : "/edit",
		            templateUrl: "views/dutylist/director.dutylist.edit.html",
		            controller : "DirDutyListEditController",
		            controllerAs : "DirDutyListEditCtrl"
		        })	
		}
})();
