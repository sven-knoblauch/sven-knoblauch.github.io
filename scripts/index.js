const n = 20;
const colors = ["#1a7788","#e04257"];
const elem_id = "color-box";
const scaling_factor = 4;
const t = 4;

const box = document.getElementById(elem_id);
let width = box.offsetWidth;
let height = box.offsetHeight;

function setup() {
	createParticles();
  	window.addEventListener('resize', updateParticle);
}

function updateParticle(){
  console.log("updated particles");
  width = box.offsetWidth;
  height = box.offsetHeight;
  clear();
  if(width < 1){
    return
  }
	for (let i = 0; i < n; i++) {
		let x = t * random(0, width/t);
		let y = t * random(0, height/t);
		let c = color(random(colors));
		let size = random(5, 5 + 2 * scaling_factor);
		
		fill(c);
		ellipse(x,y,size);
	}
}

function createParticles() {
  createCanvas(width, height).parent(elem_id);
  noStroke();
	for (let i = 0; i < n; i++) {
		
		let x = t * random(0, width/t);
		let y = t * random(0, height/t);
		let c = color(random(colors));
		let size = random(5, 5 + 2 * scaling_factor);
		
    fill(c);
		ellipse(x,y,size);
	}
}