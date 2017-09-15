"use strict";

requirejs(
	[
		"src/point"
		, "src/link"
		, "src/points"
	], function(
		Point
		, Link
		, Points
	){
	
		// create canvas
		var canvas = document.createElement('canvas')
			, ctx = canvas.getContext('2d')
			, divCanvas = document.createElement('div')
			, fps = {
				div			: document.createElement('div')
				, samples	: []
				, window	: 20
				, count		: 0
			}
			, points = new Points()
			, i
			, p
			, radius = 60		// min distance to create a link, in px
			, getRnd = function( max ){ return Math.floor( max * Math.random()); }
		;
		
		
		// setup canvas
		canvas.width = 1280;
		canvas.height = 720;

		divCanvas.appendChild(canvas);
		divCanvas.className = "centered";
		document.body.appendChild(divCanvas);

		// fps counter div
		fps.div.className = "centered";
		document.body.appendChild( fps.div );
	
	
		// create points and links
		for( i = 0; i < 200; i++) {
			p = new Point( getRnd(canvas.width), getRnd(canvas.height));
			
			p.setDirection( getRnd(canvas.width), getRnd(canvas.height));
	
			p.setSpeed( 10 + 40 * Math.random());
			p.render(ctx);
			points.add(p);
		}
		
		console.log(points.length, "points created.");
	
	
		// record video
		var capturer = new CCapture({
			format: 'png'
			, framerate: 30
			, timeLimit: 60
			, verbose: false
			, autoSaveTime: 10
		});
		capturer.start();
	
	

		function makeFrame( timestamp) {
			var i, j, Pi, Pj, px, dx, dy, dy2, selection, r2 = radius * radius;
			
			// clear canvas
			//ctx.clearRect( 0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "black";
			ctx.fillRect( 0, 0, canvas.width, canvas.height);
			
			// update all points
			for( i = 0; i < points.length; i++) {
				Pi = points.get(i);
				Pi.update();

				// fix to boundaries
				if( Pi.x < 0) Pi.x *= -1, Pi.v.x *= -1;
				if( Pi.y < 0) Pi.y *= -1, Pi.v.y *= -1;
				if( Pi.x > canvas.width) Pi.x = 2 * canvas.width - Pi.x, Pi.v.x *= -1;
				if( Pi.y > canvas.height) Pi.y = 2 * canvas.height - Pi.y, Pi.v.y *= -1;

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

			window.requestAnimationFrame( makeFrame );
		}
		
		// go
		makeFrame();
	
	}
);