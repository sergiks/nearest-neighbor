"use strict";

define( function(){

	const Link = function( Pa, Pb) {
		this.a = Pa;
		this.b = Pb;
	}
	
	
	Link.prototype.render = function(ctx){
		ctx.strokeStyle = "rgba( 210, 210, 210, 0.5)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo( this.a.x, this.a.y);
		ctx.lineTo( this.b.x, this.b.y);
		ctx.stroke();
	}
	
	return Link;
});
