"use strict";

define( function(){

	const Points = function( points) {
		this.points = points || [];
		this.length = this.points.length;
	}

	Points.prototype.add = function( P ){
		var i, link;
		this.points.push(P);
		return this.length = this.points.length;
	}

	Points.prototype.get = function(i){ return this.points[i]; }


	// array sorted by X-coords
	Points.prototype.getX = function(){
		return this.points.slice().sort( function(a,b){
			return a.x - b.x;
		});
	}


	return Points;
});