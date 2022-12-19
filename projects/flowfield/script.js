//define size of canvas
let box = document.getElementById("canvas_container");
let width = box.offsetWidth-2;
let height = box.offsetHeight-2;


let slider_points = document.getElementById("points_slider");
let slider_scale = document.getElementById("scale_slider");


const n = 15;
let delta = width/n;
let flowmap = new Array(n);
let noise_scale = 150,
noiseStrength = 1;

num = 200;
var particles = [num];

let ms;

function setup() {
    noLoop();
    createCanvas(width, height).parent('canvas_container');
    background(255, 255, 255, 255);

    make_flow_map();
    draw_flow_map();
    init_particles();
}

function draw() {
    let tmp = millis()-ms;
    if(tmp > 2000){
        noLoop();
    }
    
    if(isLooping()){
        update_particles();
    }
}

function clear_flowfield(){
    noLoop();
    init_particles();
}

function update_flowfield(){
    noise_scale = slider_scale.value;
    console.log(noise_scale);
    noLoop();
    make_flow_map();
    draw_flow_map();
    init_particles();
}

function randomize_noise_map(){
    noLoop();
    noiseSeed(random(1, 10000));
    make_flow_map();
    draw_flow_map();
}

function number_points_changed(){
    noLoop();
    init_particles();
}

function update_particles(){
    fill(0, 10);
    noStroke();
    for (let i=0; i<particles.length; i++) {
      particles[i].update();
    }
}

function init_particles(){
    num = slider_points.value;
    particles = [num];

    ms = millis();
    draw_flow_map();
    noStroke();
    for (let i=0; i<num; i++) {
        var loc = createVector(random(width*1.2), random(height), 2);
        var angle = 0;
        var dir = createVector(cos(angle), sin(angle));
        var speed = random(0.5,2);
        particles[i]= new Particle(loc, dir, speed);
    }
}

function make_flow_map(){
    for (var i = 0; i < flowmap.length; i++) {
        flowmap[i] = new Array(flowmap.length);
    }
    for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
            let x1 = x*delta;
            let y1 = y*delta;
            let tmp = noise(x1/noise_scale, y1/noise_scale);
        
            flowmap[x][y] = tmp;
        }
    }
}

function draw_flow_map(){
    background(255, 255, 255, 255);
    for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
            fill(150);
            circle(x*delta+delta/2,y*delta+delta/2,3);
            let angle = flowmap[x][y];
            let vec = p5.Vector.fromAngle(angle*TWO_PI).mult(15);
            stroke(150);
            line(x*delta+delta/2, y*delta+delta/2, x*delta+delta/2+vec.x, y*delta+delta/2+vec.y);
        }
    } 
}

function draw_for_5sec(){
    init_particles();
    loop();
}


class Particle{
    constructor(_loc,_dir,_speed){
      this.loc = _loc;
      this.dir = _dir;
      this.speed = _speed;
    }
    update() {
        this.move();
        this.checkEdges();
        this.draw();
    }
    move(){
        let angle=noise(this.loc.x/noise_scale, this.loc.y/noise_scale)*TWO_PI*noiseStrength;
        this.dir.x = cos(angle);
        this.dir.y = sin(angle);
        var vel = this.dir.copy();
        var d =1;
        vel.mult(this.speed*d);
        this.loc.add(vel);
    }
    checkEdges(){
        if (this.loc.x<0 || this.loc.x>width || this.loc.y<0 || this.loc.y>height) {    
          this.loc.x = random(width*1.2);
          this.loc.y = random(height);
        }
    }
    draw(){
        fill(0);
        ellipse(this.loc.x, this.loc.y, 2);
    }
}