define( function(){

	const Point = function( x, y) {
		this.L = [];
		
		// point coodrinates
		this.x = x;
		this.y = y;
		
		// normalized motion vector
		this.v = { x:0, y:0 };
		this.speed = 0;
		
		this.lastUpdate = new Date().getTime();
	};


	Point.prototype.render = function(ctx){
		ctx.fillStyle = 'rgb(200, 0, 0)';
		ctx.fillRect( this.x - 3, this.y - 3, 7, 7);
	}


	Point.prototype.setDirection = function( tx, ty) {
		var dx = tx - this.x
			, dy = ty - this.y
			, len = Math.sqrt( dx * dx + dy * dy)
		;
		
		this.v = {
			x: dx / len,
			y: dy / len
		};
	}

	Point.prototype.setSpeed = function( speed) {
		this.speed = speed;
	}


	Point.prototype.update = function(){
		var now = new Date().getTime()
			, dt = (now - this.lastUpdate) / 1000
			, ds = dt * this.speed
		;
		
		// speed is in pixels per second
		this.x += this.v.x * ds;
		this.y += this.v.y * ds;
		this.lastUpdate = now;
	}

	return Point;

});