(function(){
	'use strict';
	/**
	* app.map Module
	*
	* Description
	*/
	angular
		.module('app.map', [])
		.controller('MapIndexController',MapIndexController);

	MapIndexController.$inject = ['leafletData', 'GeoSvc'];
	function MapIndexController(leafletData, GeoSvc){
		var vm = this; 

		GeoSvc.getGeolocationCoordinates().then(function(coord){
	        vm.nowPos.lat = coord.latitude;
	        vm.nowPos.lng = coord.longitude;
	        vm.nowPos.zoom = 17;
	    })

	    angular.extend(vm, {
	        nowPos: {
	            lat: 24.988,
	            lng: 121.5752,
	            zoom: 17
	        },
	        controls: {
	            draw: {}
	        }
	    })

	    leafletData.getMap().then(function(map) {
	      var drawnItems = vm.controls.edit.featureGroup;
	      map.on('draw:created', function (e) {
	        var layer = e.layer;
	        drawnItems.addLayer(layer);
	        
	        FeatureCollections.push(layer.toGeoJSON())
	        
	      });
	    })
	}
})();