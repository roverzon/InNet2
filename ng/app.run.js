(function(){
	/**
	* app.run Module
	*
	* Description
	*/
	// angular
	// 	.module('app')
	// 	.run(appRun);
	
	// appRun.$inject = ['$rootScope', '$state', '$stateParams', 'store', 'jwtHelper', 'UserSvc'];

	// function appRun( $rootScope, $state, $stateParams, store, jwtHelper, UserSvc){
	// 	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
	//         if (toState.name == "anon.login") {
	//             store.remove('jwt');
	//         }else{
	//             if (toState.data && toState.data.requiredLogin) {

	//                 if (!UserSvc.isLoggedIn()) {
	//                     event.preventDefault();
	//                     $state.go('anon.login');
	//                 } 
	//                 else if (toState.data.role.indexOf(jwtHelper.decodeToken(store.get('jwt')).role) == -1 ) {
	//                     event.preventDefault();
	//                     $state.go("anon.login")
	//                 };
	//             }; 
	//         }
	//     });

	//     $rootScope.$on('$stateChangeError',function(event){
	//         event.preventDefault();
	//     });
	// }
})();