//define size of canvas
let box = document.getElementById("canvas_container1");
let width = box.offsetWidth-2;
let height = box.offsetHeight-2;

let slider_amplitute = document.getElementById("amplitute_slider");
let slider_strength = document.getElementById("strength_slider");

let len = 50;
let ampl = 4;

function setup() {
    noLoop();
    createCanvas(width, height).parent('canvas_container1');
    background(255);
    translate(0, height/2);

    plot_perlin_noise();
}

function drawGrid(w, h){
    for (var j=0; j<=w; j++){
        let y1 = map(j, 0, w, 0, height)-height/2;

        stroke('rgba(0,0,0,0.1)');
        line(0, y1, width, y1);
    }
	 for (var j=0; j<=h; j++){
        let x1 = map(j, 0, h, 0, width);

        stroke('rgba(0,0,0,0.1)');
        line(x1, 0-height/2, x1, height);
    }
}

function plot_perlin_noise(){
    background(255);
    drawGrid(20,20);
    stroke('rgba(0,0,0,1)');
    len = slider_strength.value;
    ampl = slider_amplitute.value;


    let arr = generate_random_array(len);

    let x0 = 0;
    let y0 = calculate_perlin_noise(arr, 0, ampl);

    let s = width/(len-1); 

    strokeWeight(2)

    for(let x=0.1; x<len; x=x+0.1){
        let noise = calculate_perlin_noise(arr, x, ampl);
        line(x0,y0,x*s,noise);
        x0=x*s;
        y0=noise;
    }

}

function generate_random_array(n){
    let tmp = new Array(n);
    for(let x=0;x<n;x++){
        tmp[x] = random()-0.5;
    }
    return tmp
}

function calculate_perlin_noise(arr, x, ampl){
    let a = Math.floor(x);
    let b = a+1;

    return interpolate(arr[a], arr[b], x-a)*40*ampl;
}

function interpolate(a0, a1, x)
{
    if (x < 0.0) return a0;
    if (x > 1.0) return a1;
    //return (a1 - a0) * x + a0;
    return (a1 - a0) * ((x * (x * 6.0 - 15.0) + 10.0) * x * x * x) + a0;
}

