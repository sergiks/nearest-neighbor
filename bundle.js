		// record video
		var capturer = new CCapture({
			format: 'png'
			//, framerate: 60
 			, timeLimit: 2
			, verbose: false
		});
		capturer.start();
		
		console.log("Capt started");


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
		ctx.fillRect( this.x - 2, this.y - 2, 4, 4);
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

	const Link = function( Pa, Pb) {
		this.a = Pa;
		this.b = Pb;
	}
	
	
	Link.prototype.render = function(ctx){
		ctx.strokeStyle = "rgba( 210, 210, 210, 0.5)";
		ctx.beginPath();
		ctx.moveTo( this.a.x, this.a.y);
		ctx.lineTo( this.b.x, this.b.y);
		ctx.stroke();
	}










		// create canvas
		var canvas = document.createElement('canvas')
			, ctx = canvas.getContext('2d')
			, divCanvas = document.createElement('div')
			, side = 300
			, fps = {
				div			: document.createElement('div')
				, samples	: []
				, window	: 20
				, count		: 0
			}
			, points = new Points()
			, i
			, p
			, radius = 20		// min distance to create a link, in px
			, getRnd = function(){ return Math.floor( canvas.width * Math.random()); }
		;
		
		
		// setup canvas
		canvas.width = canvas.height = side;
		divCanvas.appendChild(canvas);
		divCanvas.className = "centered";
		document.body.appendChild(divCanvas);

		// fps counter div
		fps.div.className = "centered";
		document.body.appendChild( fps.div );
	
	
		// create points and links
		for( i = 0; i < 200; i++) {
			p = new Point( getRnd(), getRnd());
			
			p.setDirection( getRnd(), getRnd());
	
			p.setSpeed( 10 + 40 * Math.random());
			p.render(ctx);
			points.add(p);
		}
		
		console.log(points.length, "points created.");
	

		function render( timestamp) {

			requestAnimationFrame( render );

			var i, j, Pi, Pj, px, dx, dy, dy2, selection, r2 = radius * radius;
			
			// clear canvas
			//ctx.clearRect( 0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'black';
			ctx.fillRect( 0, 0, canvas.width, canvas.height);
			
			// update all points
			for( i = 0; i < points.length; i++) {
				Pi = points.get(i);
				Pi.update();

				// fix to boundaries
				if( Pi.x < 0) Pi.x *= -1, Pi.v.x *= -1;
				if( Pi.y < 0) Pi.y *= -1, Pi.v.y *= -1;
				if( Pi.x > side) Pi.x = 2 * side - Pi.x, Pi.v.x *= -1;
				if( Pi.y > side) Pi.y = 2 * side - Pi.y, Pi.v.y *= -1;

				Pi.render(ctx);
			}
			
			
			px = points.getX();

			for( i = 0; i < px.length; i++) {
				Pi = px[i];
				selection = [];
				for( j = i - 1; j >= 0; j--) {
					Pj = px[j];
					dx = Pi.x - Pj.x;
					dy = Pi.y - Pj.y;
					dy2 = dy * dy;
					if( dx <= radius  &&  dy2 <= r2  &&  dx * dx + dy2 <= r2) {
						new Link( Pi, Pj).render(ctx);
					}
				}
			}
	
			// count FPS
			fps.samples.push(timestamp);
			if( fps.samples.length === fps.window + 1) {
				fps.div.innerText = ( fps.window * 1000 / (fps.samples[fps.window] - fps.samples[0])).toFixed(2) + " fps";
				fps.samples = fps.samples.slice(-1);
			}

			capturer.capture( canvas );
		}
		
		// go
		render();
