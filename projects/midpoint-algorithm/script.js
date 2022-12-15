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

	let p1 = createVector(2, 38);
	let p2 = createVector(38, 2);
	let col1 = color(255, 50, 50);
	let col2 = color(20, 50, 250);
	draw_line(p1, p2, col1, col2)

	let c1 = color(255, 204, 50);
	let v1 = createVector(20, 20);
    draw_circle(v1, 10, c1);
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

function writePixel(x, y, color){
	y = y+1;
	fill(color);
	let x1 = map(x, 0, width_buckets, 0, width);
	let y1 = map(y, 0, height_buckets, 0, -height);
	square(x1, y1, fragment_size);
}

function writeCirclePixels(x, y, p, color){
	writePixel(x+p.x, y+p.y, color);
	writePixel(-x+p.x, y+p.y, color);
	writePixel(x+p.x, -y+p.y, color);
	writePixel(-x+p.x, -y+p.y, color);
	writePixel(y+p.x, x+p.y, color);
	writePixel(-y+p.x, x+p.y, color);
	writePixel(y+p.x, -x+p.y, color);
	writePixel(-y+p.x, -x+p.y, color);
}

function draw_random_circle(){
	let a = random(255);
	let b = random(255);
	let c = random(255);

	let col = color(a,b,c);
	let p = createVector(10+Math.floor(random(20)), 10+Math.floor(random(20)));
	let r = 5 + Math.floor(random(5));

	draw_circle(p, r, col);
}

function draw_random_object(){
	if(Math.random() < 0.5){
		draw_random_circle();
	}else{
		draw_random_line();
	}
}

function draw_random_line(){
	let a = random(255);
	let b = random(255);
	let c = random(255);
	let col1 = color(a,b,c);
	a = random(255);
	b = random(255);
	c = random(255);
	let col2 = color(a,b,c);

	let p1 = createVector(Math.floor(random(40)),Math.floor(random(40)))
	let p2 = createVector(Math.floor(random(40)),Math.floor(random(40)))

	draw_line(p1, p2, col1, col2)
}

function reset_screen(){
	background(255);
	drawGrid(width_buckets, height_buckets);
}

function draw_circle(p, r, c) {
	let x = 0;
	let y = r;
	let d = 1-r;
	writeCirclePixels(x, y, p, c);
	
	while (y > x) {
		if (d < 0){
			d += 2 * x + 3;
			x++;
		}else{
			d += 2 * x - 2 * y + 5;
			x++;
			y--;
		}
		writeCirclePixels(x, y, p, c);
	}
}

function draw_line(p0, p1, c0, c1){
	let dx = abs(p1.x - p0.x);
	let dy = abs(p1.y - p0.y);
	let sx = p0.x < p1.x ? 1 : -1;
	let sy = p0.y < p1.y ? 1 : -1;
	let d = 2 * dy - dx;
	let dE = 2 * dy;
	let dN = -2 * dx;
	let dNE = 2 * (dy - dx);
	let x = p0.x;
	let y = p0.y;
	writePixel(x, y, c0);
	let alpha = 1;
	
	if(dy > dx){
		d = dy - 2 * dx;
		while(y != p1.y){
			alpha = 1-abs(p1.y-y)/dy;
			let c = lerpColor(c0, c1, alpha);
			
			if((d > 0) || (d == 0) && (sy == 1)){
				d += dN;
				y = y + sy;
			}else{
				d += dNE;
				x = x + sx;
				y = y + sy;
			}
			writePixel(x, y, c);
		}
	}else{
		while(x != p1.x){
			alpha = 1-abs(p1.x-x)/dx;
			let c = lerpColor(c0, c1, alpha);
			
			if((d < 0) || (d == 0) && (sx == 1)){
				d += dE;
				x = x + sx;
			}else{
				d += dNE;
				x = x + sx;
				y = y + sy;
			}
			writePixel(x, y, c);
		}
	}
}