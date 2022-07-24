//define size of canvas
let box = document.getElementById("canvas_container");
let width = box.offsetWidth-2;
let height = box.offsetHeight-2;

let points_size = 10;

let points = [];
let classes = [];
let perceptron;

function setup() {
    createCanvas(width, height).parent('canvas_container');
    background(255);
    translate(0, height);
    noLoop();

    drawGrid();
    createPoints(150,3,7,1);
    drawPoints();
    start_training();
}

function drawGrid(){
    strokeWeight(1);
    for (var j=0; j<=10; j++){
        let y1 = map(j, 0, 10, 0, -height);
        let x1 = map(j, 0, 10, 0, width);

        stroke('rgba(0,0,0,0.5)');
        line(0, y1, width, y1);
        line(x1, 0, x1, -height);
    }
}

function randomizePoints(){
    clear();
    background(255);
    drawGrid();
    points = [];
    createPoints(150,3,7,1);
    drawPoints();
    start_training();
}

function start_training(){
    perceptron = new Perceptron();
    perceptron.train(100);
    drawDecisionLine(perceptron.weight);
}

function drawPoints(){
    for(let i=0; i < points.length; i++){
        let x = map(points[i].x, 0, 10, 0, width);
        let y = map(points[i].y, 0, 10, 0, -height);
        if(classes[i]==1){
            fill('rgba(255,157,0,0.7)');
        }else{
            fill('rgba(0,191,255,0.7)');
        }

        strokeWeight(2);        
        stroke('rgba(40,40,40,1)');
        ellipse(x, y, points_size, points_size);
    }
}

function createPoints(numberPoints, mean0, mean1, std){
    for(let i=0; i<numberPoints/2; i++){
        let x = randomGaussian(mean0, std);
        let y = randomGaussian(mean0, std);
        let c = createVector(x, y, 1);
        points.push(c);
        classes.push(-1);


        x = randomGaussian(mean1, std);
        y = randomGaussian(mean1, std);
        c = createVector(x, y, 1);
        points.push(c);
        classes.push(1);
    }
}


function drawDecisionLine(w){
    p = [];
    
    p1 = (-w.z)/w.y;
    p2 = (-w.x*10-w.z)/w.y;
    p3 = w.z/(-w.x);
    p4 = (10*w.y+w.z)/(-w.x);

    if(p1 <= 10 && p1 >= 0){
        p.push(createVector(0, p1));
    }
    if(p2 <= 10 && p2 >= 0){
        p.push(createVector(10, p2));
    }
    if(p3 <= 10 && p3 >= 0){
        p.push(createVector(p3, 0));
    }
    if(p4 <= 10 && p4 >= 0){
        p.push(createVector(p4, 10));
    }
    
    let x1 = map(p[0].x, 0, 10, 0, width);
    let y1 = map(p[0].y, 0, 10, 0, -height);
    let x2 = map(p[1].x, 0, 10, 0, width);
    let y2 = map(p[1].y, 0, 10, 0, -height);

    
    strokeWeight(4);
    stroke('rgba(20,20,20,0.7)');
    line(x1, y1, x2, y2);
}

class Perceptron {
    constructor(){
        this.weight = createVector(-1,1,0);
        this.all_weights = [];
    }
    
    predict(x){
        let y = p5.Vector.dot(this.weight, x);
        if(y>=0){
            return 1;
        }else{
            return -1;
        }
    }

    test_accuracy(){
        let counter = 0;
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            let label = classes[i];
            let y = this.predict(p);
            if(y==label){
                counter++;
            }
        }
        return counter/points.length;
    }

    train(steps){
        let t=0;
        while(t<steps){
            let allCorrect = true;
            for (let idc = 0; idc < points.length; idc++) {
                let y = p5.Vector.dot(this.weight, points[idc]) * classes[idc];
                if(y < 0){
                    allCorrect=false;
                    let delta = p5.Vector.mult(points[idc], classes[idc]);
                    this.weight = this.weight.add(delta);
                }

            }
            if(allCorrect){
                break;
            }
            t++;
        }
    }
}