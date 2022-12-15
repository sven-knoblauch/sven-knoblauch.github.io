//define size of canvas
let box = document.getElementById("canvas_container");
let width = box.offsetWidth-2;
let height = box.offsetHeight-2;

const width_buckets = 40;
const height_buckets = 40;
const fragment_size = width / width_buckets;

function setup() {
    createCanvas(width, height).parent('canvas_container');
    background(255);
    translate(0, height);
    noLoop();

    
    drawGrid(width_buckets, height_buckets);

	let v1 = createVector(5, 5);
	let v2 = createVector(30, 10);
	let v3 = createVector(20, 30);
	
	let c1 = color(255, 204, 50);
	let c2 = color(50, 204, 255);
	let c3 = color(255, 50, 204);
	
	
	draw_triangle([v1, v2, v3], [c1, c2, c3]);
}

function drawGrid(w, h){
    for (var j=0; j<=w; j++){
        let y1 = map(j, 0, w, 0, -height);

        stroke('rgba(0,0,0,0.5)');
        line(0, y1, width, y1);
    }
	 for (var j=0; j<=h; j++){
        let x1 = map(j, 0, h, 0, width);

        stroke('rgba(0,0,0,0.5)');
        line(x1, 0, x1, -height);
    }
}

function reset_screen(){
	background(255);
    drawGrid(width_buckets, height_buckets);
}

function draw_random_triangle(){
	reset_screen();
	let v1 = createVector(2+Math.floor(random(10)), 2+Math.floor(random(10)));
	let v2 = createVector(30+Math.floor(random(10)), 10+Math.floor(random(20)));
	let v3 = createVector(2+Math.floor(random(10)), 30+Math.floor(random(10)));
	
	let c1 = color(random(255), random(255), random(255));
	let c2 = color(random(255), random(255), random(255));
	let c3 = color(random(255), random(255), random(255));
	
	draw_triangle([v1, v2, v3], [c1, c2, c3]);
}

function draw_triangle(points, colors) {
	
	let z = points.map((k, i) => [k, colors[i]]);
	z.sort((a, b) => {return a[0].y - b[0].y;});
	
	let p0 = z[0][0];
	let p1 = z[1][0];
	let p2 = z[2][0];
	let c1 = z[0][1];
	let c2 = z[1][1];
	let c3 = z[2][1];
	
	let xl = p0.x;
	let xr = p0.x;
	let y = p0.y;
	let deltaL = (p2.x - p0.x)/(p2.y - p0.y);
	let deltaR = (p1.x - p0.x)/(p1.y - p0.y);
	let nb = p1.y-p0.y;
	let nt = p2.y-p1.y;
	
	let side_vec1 = p5.Vector.sub(p2, p0);
	let normale = createVector(side_vec1.y, -side_vec1.x);
	let side_vec2 = p5.Vector.sub(p1, p0);
	let side = Math.sign(p5.Vector.dot(normale, side_vec2));
	
	if(side<0){
		deltaL = (p1.x - p0.x)/(p1.y - p0.y);
		deltaR = (p2.x - p0.x)/(p2.y - p0.y);
	}
	
	for(let i=0; i<nb; i++) {
		let alpha1 = (y-p0.y)/(nb);
		let alpha2 = (y-p0.y)/(nt+nb);
		let c_blend1 = lerpColor(c1, c3, alpha2);
		let c_blend2 = lerpColor(c1, c2, alpha1);
		processSegment(y, round(xl), round(xr), c_blend1, c_blend2);
		xl += deltaL;
		xr += deltaR;
		y++;
	}

	if(side<0){
		deltaL = (p2.x - p1.x)/(p2.y - p1.y);
	}else{
		deltaR = (p2.x - p1.x)/(p2.y - p1.y);
	}
	
	for(let i=0; i<=nt; i++) {
		alpha1 = (y-p1.y)/(nt);
		alpha2 = (y-p0.y)/(nt+nb);
		c_blend1 = lerpColor(c1, c3, alpha2);
		c_blend2 = lerpColor(c2, c3, alpha1);
		processSegment(y, round(xl), round(xr), c_blend1, c_blend2);
		xl += deltaL;
		xr += deltaR;
		y++;
	}
}


function writePixel(x, y, color){
	y = y+1;
	fill(color);
	let x1 = map(x, 0, width_buckets, 0, width);
	let y1 = map(y, 0, height_buckets, 0, -height);
	square(x1, y1, fragment_size);
}

function processSegment(y, xl, xr, c0, c1) {
	let alpha = 0;
	let dx = xr - xl+1;
	for(let x=xl; x<=xr; x++) {
		alpha = 1-((xr - x)/dx);
		let c = lerpColor(c0, c1, alpha);
		writePixel(x, y, c);
	}
}