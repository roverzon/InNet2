(function(){
	'use strict';
	/**
	* app.geo Module
	*
	* Description
	*/
	angular
		.module('app.geo')
		.service('GeoSvc',GeoSvc);

	GeoSvc.$inject = ['$q','$http'];

	function GeoSvc(){
		var svc = this; 
		svc.getGeolocationCoordinates = function() {
	        var deferred = $q.defer();
	        navigator.geolocation.getCurrentPosition(
	            function(position) { deferred.resolve(position.coords); },
	            function(error) { deferred.resolve(null); }
	        );
	        return deferred.promise;
	    };

	    svc.getGeoEncodedInfo = function(address){
	    	var deferred = $q.defer();
	    	// return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ address +'&key=AIzaSyAxq-ZkxRr1ZArBXFDOo8xgi4Cl2PeitAo')
	    	var geocoder = new google.maps.Geocoder();
	    	if (geocoder) {
		      geocoder.geocode({ 'address': address }, function (results, status) {
		         if (status == google.maps.GeocoderStatus.OK) {
		            deferred.resolve(results[0].geometry.location) 
		         }
		         else {
		            deferred.resolve( "Geocoding failed: " + status )
		         }
		      });
		   } 
		   return deferred.promise;  
	    };

	    svc.fetchBaseLocation = function(corps){
	    	return $http.get('/api/geolocations?corps=' + corps)
	    };

	    svc.getDistance = function( from_loc , to_loc ){

	    	if (typeof(Number.prototype.toRad) === "undefined") {
			  Number.prototype.toRad = function() {
			    return svc * Math.PI / 180;
			  }
			}
			var R = 6371; // Radius of the earth in km
			var dLat = (to_loc.lat - from_loc.lat ).toRad();  // Javascript functions in radians
			var dLon = (to_loc.lng - from_loc.lng ).toRad(); 
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			        Math.cos(from_loc.lat.toRad()) * Math.cos(to_loc.lat.toRad()) * 
			        Math.sin(dLon/2) * Math.sin(dLon/2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			return R * c;
	    };

	    svc.defaultLocation = function(){
	    	return { lat : 25.0927297 , lng :  121.4608639, address : null};
	    };
	};
})();