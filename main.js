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

var last;
var dt;

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

function playNote(note) {
    userStartAudio();
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
    var circleSize = WIDTH / 100;
    for (var i = 0; i < WIDTH; i += 1.2 * circleSize) {
        var e = new Entity(new Vector(i, circleSize), circleSize, circleSize, 
            color(random(100, 255), random(100, 255), random(100, 255))
        );
        // e.a = new Vector(0, Math.sqrt(i) * 10);
//        e.a = new Vector(0, 98);
        objects.push(e);
    }

    walls.push(new Entity(new Vector(0, HEIGHT - 50), WIDTH, 500, color(100, 100, 100)));

    last = new Date().getTime();
}

let gravityUpdate = 0;
let gravityDelay = 0.020;

function update() {
    if (gravityUpdate >= gravityDelay) {
        for (var i = 0; i < objects.length; i++) {
            let e = objects[i];
            if (e.a.equals(0, 0)) {
                e.a = new Vector(0, 98);
                gravityUpdate = 0;
                break;
            }        
        }
    } else {
        gravityUpdate += dt;
    }

    objects.forEach(e => {
        walls.forEach(wall => {
            var ax = e.p.x, ay = e.p.y, aw = e.width, ah = e.height;
            var bx = wall.p.x, by = wall.p.y, bw = wall.width, bh = wall.height;
            if (
                bx + bw > ax &&
                by + bh > ay &&
                ax + aw > bx &&
                ay + ah > by
            ) {
                e.v = e.v.mult(-1);
            }
        });
        e.v = e.v.add(e.a.mult(dt));
        e.p = e.p.add(e.v.mult(dt));
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