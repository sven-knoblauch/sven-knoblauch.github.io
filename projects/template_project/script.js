//define size of canvas
const box = document.getElementById("canvas_container");
const width = box.offsetWidth-2;
const height = box.offsetHeight-2;

//get number input element
let number_input_x_n = document.getElementById("number_input_x_n");
let number_input_x_n1 = document.getElementById("number_input_x_n1");
let number_input_y_n = document.getElementById("number_input_y_n");
let number_input_y_n1 = document.getElementById("number_input_y_n1");

//function selection
let function_select = document.getElementById("function_select");

//space details
const delta_t = 0.1;

//define space
let x_min = -2;
let x_max = 2;
let y_min = -1;
let y_max = 3;

//constant for derivative
const h = 0.0000001;

//function
let f;

//points for drawing graph
let points = [];

//state variables
let start_x = 1.5;
let x;
let x_old;

function setup() {
    createCanvas(width, height).parent('canvas_container');
    background(255);
    translate(0, height)
    noLoop();

    f = (x) => {return x**2};

    initGraph();
}

function initGraph(){
    drawGrid();
    calculatePoints();
    draw_connect_Points();

    x = start_x;
    nextStep();
}

function drawCurrentState(){
    x = x_old;
    nextStep();
}

function nextStep(){ 
    clear();
    background(255);
    drawGrid();
    draw_connect_Points();

    x_old = x;
    x = makeOneNewtonRaphsonStep(f, x);
    updateGUI();
}

function changeFunction(){
    switch (function_select.value) {
        case "0":
            f = (x) => {return x}
            start_x = 1;
            x_min = -2;
            x_max = 2;
            y_min = -2;
            y_max = 2;
            break;
        case "1":
            f = (x) => {return x**2}
            start_x = 1.5;
            x_min = -2;
            x_max = 2;
            y_min = -1;
            y_max = 3;
            break;
        case "2":
            f = (x) => {return x**3}
            start_x = 1.2;
            x_min = -2;
            x_max = 2;
            y_min = -2;
            y_max = 2;
            break;
        case "3":
            f = (x) => {return Math.tanh(x)}
            start_x = 1;
            x_min = -3;
            x_max = 3;
            y_min = -2;
            y_max = 2;
            break;
        default:
            break;
    }
    calculatePoints();
    resetGraph();
}

function updateStartX(){
    x = parseFloat(number_input_x_n.value);
    nextStep();
}

function updateGUI(){
    number_input_x_n.value = x_old.toFixed(3);
    number_input_y_n.value = f(x_old).toFixed(3);
    number_input_x_n1.value = x.toFixed(3);
    number_input_y_n1.value = f(x).toFixed(3);
}

function resetGraph(){

    x = start_x;

    nextStep();
}

function makeOneNewtonRaphsonStep(f, x_old){
    const f1 = derivative1(f);                      //first derivative
    const m = f1(x_old);                            //slope of tangent
    const a = f(x_old)-m*x_old;                     //y-intercept
    const g = (z) => {return z*m + a};              //tangent

    //calculate tangente
    let tangent_y1 = g(x_min);
    let tangent_y2 = g(x_max);
    tangent_y1 = map(tangent_y1, y_min, y_max, 0, -height);
    tangent_y2 = map(tangent_y2, y_min, y_max, 0, -height);

    // calculate new x
    const x_new = -a/m;
    const p_old_x = map(x_old, x_min, x_max, 0, width);
    const p_old_y = map(f(x_old), y_min, y_max, 0, -height);
    const p_new_x = map(x_new, x_min, x_max, 0, width);
    const p_new_y = map(f(x_new), y_min, y_max, 0, -height);

    //calculate point with y=0
    const x = map(x_new, x_min, x_max, 0, width);
    const y = map(0, y_min, y_max, 0, -height);

    //draw tangent line
    stroke('rgba(0, 67, 201, 0.7)');
    line(0, tangent_y1, width, tangent_y2);

    //line from x interception of tangent to function
    stroke('rgba(255, 0, 0, 0.7)');
    line(x, y, p_new_x, p_new_y);

    //draw point with y=0
    stroke('rgba(0, 67, 201, 0.7)');
    ellipse(x,y,10,10);

    //draw point of new x
    stroke('rgba(255, 0, 0, 0.7)');
    ellipse(p_new_x, p_new_y, 10, 10);

    // draw current point
    stroke(0);
    ellipse(p_old_x, p_old_y, 10, 10);

    return x_new
}

function drawGrid(){
    for (let j=floor(x_min); j<= x_max+1; j++){
        strokeWeight(1);
        if(j==0){
            strokeWeight(3);
        }
        const x1 = map(j, x_min, x_max, 0, width);
        stroke('rgba(0,0,0,0.5)');
        line(x1, 0, x1, -height);
    }
    
    for (let j=floor(y_min); j<= y_max+1; j++){
        strokeWeight(1);
        if(j==0){
            strokeWeight(3);
        }
        const y1 = map(j, y_min, y_max, 0, -height);
        stroke('rgba(0,0,0,0.5)');
        line(0, y1, width, y1);
    }
}

function derivative1(f){
    return (x) => {return (f(x+h)-f(x))/h};
}

function calculatePoints(){
    points = [];
    for (i = x_min; i <= x_max; i += delta_t) {
        const t = parseFloat(i.toFixed(2));

        let v = createVector(t, f(t));
        points.push(v);
    }
}

function draw_connect_Points(){
    for (let idc = 0; idc < points.length-1; idc++) {
        let p1 = points[idc];
        let p2 = points[idc+1];
        
        x1 = map(p1.x, x_min, x_max, 0, width);
        y1 = map(p1.y, y_min, y_max, 0, -height);
        x2 = map(p2.x, x_min, x_max, 0, width);
        y2 = map(p2.y, y_min, y_max, 0, -height);

        stroke(0);
        strokeWeight(3)
        line(x1,y1,x2,y2);
    }
}
