var dots = []


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
			raster.size = new paper.Size(64, 48)

			var y = 0;
			var x = 0;
			dots=[];

			for (y = 0; y < raster.height; y++) {
				for (x = 0; x < raster.width; x++) {
				var color = raster.getPixel(x, y);
					dots.push({x:x,y:y,c:parseFloat( (1 - color.gray).toFixed(3) ) });
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
	ctx.lineWidth=0.2
	ctx.strokeStyle="#fff"

	for(i=0;i<dots.length;i++){
		ctx.beginPath()
			ctx.fillStyle = "rgb("+ (255-(Math.round(dots[i].c*255))) + "," + (255-(Math.round(dots[i].c*255))) + "," + (255-(Math.round(dots[i].c*255))) + ")";
			console.log(ctx.fillStyle)
			ctx.rect(dots[i].x*5,dots[i].y*5,5,5)
			ctx.fill()
			ctx.stroke()
	}



}

