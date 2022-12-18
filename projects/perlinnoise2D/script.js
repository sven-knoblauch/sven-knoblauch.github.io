//define size of canvas
let box = document.getElementById("canvas_container1");
let width = box.offsetWidth-2;
let height = box.offsetHeight-2;

let slider_scale = document.getElementById("scale_slider");

let w=width;
let h=height;

let noisemap;

let scale = 200;

function setup() {
    noLoop();
    createCanvas(width, height).parent('canvas_container1');
    background(255);
    pixelDensity(1);
    
    noisemap = make_noise_map(w+1, h+1);
    plot_perlin_noise_map();
}

function plot_random_perlin_map(){
    noisemap = make_noise_map(w, h);
    plot_perlin_noise_map();
}

function plot_perlin_noise_map(){
    scale = slider_scale.value;
    loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let val = get_noise_value(x/scale, y/scale);
            let r = val*255+50;
            var index = (x+y*width)*4;
            pixels[index+0] = r;
            pixels[index+1] = r;
            pixels[index+2] = r;
            pixels[index+3] = 255;
        }
    }
    updatePixels();
}

function get_noise_value(x, y){
    let x0 = Math.floor(x);
    let x1 = x0+1;
    let y0 = Math.floor(y);
    let y1 = y0+1;
    let sx = x - x0;
    let sy = y - y0;
    let n0 = dotGridGradient(x0, y0, x, y);
    let n1 = dotGridGradient(x1, y0, x, y);
    let ix0 = interpolate(n0, n1, sx);
    n0 = dotGridGradient(x0, y1, x, y);
    n1 = dotGridGradient(x1, y1, x, y);
    let ix1 = interpolate(n0, n1, sx);
    return interpolate(ix0, ix1, sy);
}

function randomGradient(ix, iy)
{
    let r = noisemap[ix][iy];
    return p5.Vector.fromAngle(r*TWO_PI);
}

function interpolate(a0, a1, x)
{
    if (x < 0.0) return a0;
    if (x > 1.0) return a1;
    return (a1 - a0) * ((x * (x * 6.0 - 15.0) + 10.0) * x * x * x) + a0;
}

function dotGridGradient(ix, iy, x, y)
{
    let gradient = randomGradient(ix, iy);
    let dx = x - ix;
    let dy = y - iy;
    return dx * gradient.x + dy * gradient.y;
}

function make_noise_map(w, h){
    noisemap = new Array(w);
    for (var i = 0; i < w; i++) {
        noisemap[i] = new Array(h);
    }
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let n = random();
            noisemap[x][y] = n;
        }
    }
    return noisemap;
}