class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(b) {
        return new Vector(this.x + b.x, this.y + b.y);
    }

    mult(a) {
        return new Vector(this.x * a, this.y * a);
    }

    equals(v) {
        return this.x == v.x && this.y == v.y;
    }

    equals(x, y) {
        return this.x == x && this.y == y;
    }

    dist(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    abs() {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    theta() {
        return Math.atan(this.y / this.x);
    }

    distMag(v) {
        let dist = this.dist(v);
        return {p: dist.mag(), theta: dist.theta()};
    }
}

class Entity {
    constructor(pos, width, height, color) {
        this.p = pos;
        this.v = new Vector(0, 0);
        this.a = new Vector(0, 0);
        this.width = width;
        this.height = height;
        this.color = color;
    }
};

function random(min, max) {
    return Math.floor(Math.random() * max + min);
}

var objects = [];
var walls = [];
var WIDTH = 1200;
var HEIGHT = 800;
var circleSize = WIDTH / 10;

var last;
var dt;

let notes = [ 60, 62, 64, 65, 67, 69, 71];

// For automatically playing the song
let index = 0;
let song = [
  { note: 4, duration: 400, display: "D" },
  { note: 0, duration: 200, display: "G" },
  { note: 1, duration: 200, display: "A" },
  { note: 2, duration: 200, display: "B" },
  { note: 3, duration: 200, display: "C" },
  { note: 4, duration: 400, display: "D" },
  { note: 0, duration: 400, display: "G" },
  { note: 0, duration: 400, display: "G" }
];
let trigger = 0;
let autoplay = false;
let osc;


function clamp(val, min, max) {
    if (val < min) {
        return min;
    }
    if (val > max) {
        return max;
    }

    return val;
}

function isIn(val, min, max) {
    return val >= min && val <= max;
}

function playNote(note, duration) {
    osc.freq(midiToFreq(note));
  // Fade it in
  osc.fade(0.5,0.2);

  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function() {
      osc.fade(0,0.2);
    }, duration-50);
  }
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
      // A triangle oscillator
  osc = new p5.TriOsc();
  // Start silent
  osc.start();
  osc.amp(0);

    for (var i = 20; i < WIDTH - 100; i += 1.2 * circleSize) {
        var e = new Entity(new Vector(i, HEIGHT / 2 - circleSize), circleSize, circleSize, 
            color(random(100, 255), random(100, 255), random(100, 255))
        );
        e.v.x = 50;
        // e.a = new Vector(0, Math.sqrt(i) * 10);
//        e.a = new Vector(0, 98);
        objects.push(e);
    }

    walls.push(new Entity(new Vector(0, HEIGHT - 50), WIDTH, 500, color(100, 100, 100)));
    walls.push(new Entity(new Vector(0, 0), WIDTH, 50, color(100, 100, 100)));
    walls.push(new Entity(new Vector(0, 0), 10, HEIGHT, color(100, 100, 100)));
    walls.push(new Entity(new Vector(WIDTH - 10, 0), 10, HEIGHT, color(100, 100, 100)));

    last = new Date().getTime();
}

let gravityUpdate = 0;
let gravityDelay = 0.050;

function update() {
    if (gravityUpdate >= gravityDelay) {
        for (var i = 0; i < objects.length; i++) {
            let e = objects[i];
            if (e.a.equals(0, 0)) {
                e.a = new Vector(0, 98);
                gravityUpdate = 0;
                break;
            }        
            if (i == objects.length - 1) {
            }
        }
    } else {
        gravityUpdate += dt;
    }

    objects.forEach((e, i) => {
        // objects.forEach((e2, j) => {
            // let d = e.p.distMag(e2.p);
            // console.log(e.p.distMag(e2.p))
            // if (i != j && d.p <= circleSize) {
                // e.v = e.v.mult(-1);
                // e2.v = e2.v.mult(-1);
            // }
        // });
        let playSound = false;
        walls.forEach(wall => {
            var ax = e.p.x, ay = e.p.y, aw = e.width, ah = e.height;
            var bx = wall.p.x, by = wall.p.y, bw = wall.width, bh = wall.height;
            if (
                bx + bw > ax &&
                ax + aw > bx
            ) {
                e.v.x = e.v.x * -1;
                playSound = true
            }
            if (by + bh > ay && ay + ah > by) {
                e.v.y = e.v.y * -1;
                playSound = true;
            }

        });
        e.v = e.v.add(e.a.mult(dt));
        e.p = e.p.add(e.v.mult(dt));
            if (playSound) {
                playNote(notes[song[trigger].note], song[index].duration  / 2);

                trigger++;

                if (trigger >= song.length) {
                    trigger = 0;
                }
            }
    });
}

function draw() {
    const now = new Date().getTime();
    dt = now - last;
    last = now;
    background(0, 0, 0);

    dt *= 0.001;

    update();

    objects.forEach(e => {
        fill(e.color);
        ellipse(e.p.x + e.width / 2, e.p.y + e.height / 2, e.width, e.height);
    });

    walls.forEach(e => {
        fill(e.color);
        rect(e.p.x, e.p.y, e.width, e.height);
    });
}