(function(){
	'use strict';
	/**
	* app.strikeTeam Module
	*
	* Description
	*/
	angular
		.module('app.strikeTeam', [])
		.factory('StMissionFac',StMissionFac);

	StMissionFac.$inject = [];
	function StMissionFac(){
		return {
			groups: function(){
				return {
					corps : [ "聯絡組" , "水源組" , "後勤組"],
					squadron : [""],
					branch : ["帶隊官","滅火小組","搜救小組","搶救小組","後勤小組"],
					preSt  : ["搜救小組","搶救小組","滅火小組"]
				}
			},
			position : function(){
				return {
					defaultPos : "第一面",
					poss : ["第一面","第二面","第三面","第四面"]
				}
			},
			area : function(){
				return {
					defaultArea : "第一區",
					areas : ["第一區","第二區","第三區","第四區","第五區"]
				};
			}
		};
	};
})();