var dots = []
var zmin
var zmax
var zscale

function take_snapshot() {
			// take snapshot and get image data
			Webcam.snap( function(data_uri) {
				// display results in page
				document.getElementById('results').innerHTML = 
					'image' + 
					'<img src="'+data_uri+'" id="pic"/>';
			} );

			get_image()
}


function get_image() {

			canvas = document.getElementById('myCanvas0')
			paper.setup(canvas)
			var raster = new paper.Raster('pic')
			raster.on('load', function() {
			raster.size = new paper.Size(128, 96)

			var y = 0;
			var x = 0;
			dots=[];

			for (y = 0; y < raster.height; y++) {
				if (y % 2 === 0){ 
					for (x = 0; x < raster.width; x++) {
						var color = raster.getPixel(x, y);
						dots.push({x:x,y:y,c:parseFloat( (1 - color.gray).toFixed(3) ) });
					}
				}
				else if (y % 2 === 1){
			      for(x = raster.width-1; x >= 0; x--) {
						color = raster.getPixel(x, y);
			         dots.push({x:x,y:y,c:parseFloat( (1 - color.gray).toFixed(3) ) });
		      	}
				}
			}
		

			for (x = 0; x < raster.width; x++) {
				if (x % 2 === 0){ 
					for(y = raster.height-1; y >= 0; y--) {
						var color = raster.getPixel(x, y);
						dots.push({x:x,y:y,c:parseFloat( (1 - color.gray).toFixed(3) ) });
					}
				}
				else if (x % 2 === 1){
					for (y = 0; y < raster.height; y++) {
						color = raster.getPixel(x, y);
			         dots.push({x:x,y:y,c:parseFloat( (1 - color.gray).toFixed(3) ) });
		      	}
				}
			}


	
			//console.log(dots)
			
			draw()

			});

}


function draw(){

	c = document.getElementById("myCanvas")
	ctx = c.getContext("2d")

	ctx.canvas.height = 240
	ctx.canvas.width = 320

	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
	ctx.strokeStyle="#fff"

	zmin = Math.min.apply(this,$.map(dots, function(o){ return o.c; }))
	zmax = Math.max.apply(this,$.map(dots, function(o){ return o.c; }))
	zscale = 1/(zmax-zmin)

	for(i=0;i<dots.length;i++){
		ctx.beginPath()
			ctx.fillStyle = "rgb("+ (255-(Math.round((dots[i].c-zmin*zscale)*255))) + "," + (255-(Math.round((dots[i].c-zmin*zscale)*255))) + "," + (255-(Math.round((dots[i].c-zmin*zscale)*255))) + ")";
			ctx.rect(dots[i].x*2.5,dots[i].y*2.5,2.5,2.5)
			ctx.fill()
	}

	//grid
	ctx.lineWidth=0.2
	for(i=0;i<128;i++){
		ctx.beginPath()
		ctx.moveTo(i*2.5,0)
		ctx.lineTo(i*2.5,240)
		ctx.stroke()
	}

	for(i=0;i<96;i++){
		ctx.beginPath()
		ctx.moveTo(0,i*2.5)
		ctx.lineTo(320,i*2.5)
		ctx.stroke()
	}
	document.getElementById("submit").style.display="inline"

}


function make(){




//console.log(zmin)
//console.log(zmax)


var scale = 0.4
var depth = -4 

g = "g21\n"
g += "g1f200\n"
g += "g0z5\n"
g += "m4\n"
g += "g4p10\n"

g+= "g0x" + (dots[0].x*scale).toFixed(3) + "y" + (-dots[0].y*scale).toFixed(3) + "\n"

for(i=0;i<dots.length;i++){
	g+= "g1x" + (dots[i].x*scale).toFixed(3) + "y" + (-dots[i].y*scale).toFixed(3) + "z" + (((dots[i].c-zmin)*zscale)*depth).toFixed(3) + "\n"
}

g += "g0z5\n"
g += "m5\n"
g += "m30\n"

//console.log(g)


fabmo.submitJob({
	file : g,
	filename : 'webcam.g',
	name : 'webcam',
	description : 'surface'   
})



}





