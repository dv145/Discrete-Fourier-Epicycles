const USER = 0;
const FOURIER = 1;

let x = [];
let y = [];
let fourierY;
let fourierX;
let drawing = [];
let time = 0;
let path = [];
let state;

function mousePressed(){
  state = USER;
  drawing = [];
}

function mouseReleased(){
  state = FOURIER;
  
  for (let i = 0; i < drawing.length; i++) {
    x.push(drawing[i].x);
    y.push(drawing[i].y);
  }

  fourierX = dft(x);
  fourierY = dft(y);

  fourierX.sort((a, b) => b.amp - a.amp);
  fourierY.sort((a, b) => b.amp - a.amp);
  
  
}

function setup() {
  createCanvas(600, 400);
  
  state = -1;
  
}

function epicycle(x, y, rot, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevX = x;
    let prevY = y;

    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;

    x += radius * cos(freq * time + phase + rot);
    y += radius * sin(freq * time + phase + rot);

    stroke(255, 70);
    noFill();
    ellipse(prevX, prevY, radius * 2);

    stroke(255);
    line(prevX, prevY, x, y);
    //ellipse(x,y, 8);
  }

  return createVector(x, y);
}

function draw() {
  background(0);

  if (state == USER) {
    
    let point = createVector(mouseX- width/2, mouseY - height/2);
    drawing.push(point);
    
    stroke(color(96, 254, 82));
    noFill();
    beginShape();
    for (let v of drawing){
      vertex(v.x + width/2, v.y + height/2);
    }
    endShape();
  } 
  
  else if (state == FOURIER) {
    stroke(color(119, 128, 250));
    noFill();

    let x = 0;
    let y = 0;

    let vx = epicycle(300, 50, 0, fourierX);
    let vy = epicycle(50, 200, PI / 2, fourierY);

    let v = createVector(vx.x, vy.y);

    path.unshift(v);

    line(vx.x, vx.y, v.x, v.y);
    line(vy.x, vy.y, v.x, v.y);

    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y);
    }
    endShape();

    if (path.length > drawing.length/1.006) {
      
    
      path.pop();
      
    }

    const dt = (2 * PI) / fourierY.length;
    console.log(dt);

    if (time > 2 * PI) {
    }

    time += dt;
  }
}

function ep(x, y, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevX = x;
    let prevY = y;

    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;

    x += radius * cos(freq * time + phase + PI / 2);
    y += radius * sin(freq * time + phase + PI / 2);

    stroke(255, 70);
    noFill();
    ellipse(prevX, prevY, radius * 2);

    stroke(color(245, 254, 153));
    line(prevX, prevY, x, y);
    //ellipse(x,y, 8);
  }
}

function dft(w) {
  const X = [];
  const N = w.length;
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (TWO_PI * k * n) / N;
      re += w[n] * cos(phi);
      im -= w[n] * sin(phi);
    }
    re = re / N;
    im = im / N;

    let freq = k;
    let amp = sqrt(re * re + im * im);
    let phase = atan2(im, re);
    X[k] = { re, im, freq, amp, phase };
  }
  return X;
}
