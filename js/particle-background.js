"use strict"

import { Point, Vec2d } from "./Vec2d.js";
import { rand } from "./util.js";
import Config from "./background-config.js";
import Debug from "./debug.js";

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let lastTime = document.timeline.currentTime;
let mousePressed = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX;
let mouseY;

let particles = [];
let totalParticles;
let impactRadius = Config.IMPACT_RADIUS;

class Particle {
    constructor(x, y) {
        this.coords = new Point(x,y);
        this.direction = new Vec2d(Vec2d.Y_UNIT_VECTOR);
        this.size = rand(Config.MIN_PARTICLE_SIZE, Config.MAX_PARTICLE_SIZE);
        this.initialSpeedY = rand(Config.PARTICLE_INIT_SPEED_Y_MIN, Config.PARTICLE_INIT_SPEED_Y_MAX);
        this.speedY = this.initialSpeedY;
        this.speedX = 0;
        this.color = "rgba(255, 255, 255, 0.7)";
    }

    update(dt) {
        const direction = this.direction.coords;
        updateSpeed(this);
        updateDirection(direction, Vec2d.Y_UNIT_VECTOR.coords);
        this.coords.y += dt * direction.y * this.speedY;
        this.coords.x += dt * direction.x * this.speedX;

        const outOfBounds = this.coords.y > canvas.height || (this.coords.x < 0 || this.coords.x > canvas.width);
        
        if(outOfBounds) {
            this.reset();
        }
    }

    reset() {
        this.speedY = this.initialSpeedY;
        this.speedX = 0;
        this.coords.y = 0;
        this.coords.x = Math.random() * canvas.width;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.coords.x, this.coords.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    toString() {
        return `${this.id}: pos: ${this.coords}, speedX: ${this.speedX}, speedY: ${this.speedY}, direction: ${this.direction}`;
    }
}

function init() {
    configure();
    for(let i = 0; i < totalParticles; ++i) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function update(t) {
    let dt = (t - lastTime);

    // handle refocus behaviour
    // if dt will in a large animation jump, set dt = 0 for no change
    if(dt >= Config.DT_THRESHOLD_MILLIS) {
         dt = 0;
    }

    lastTime = t;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Debug.debugParticle(particles[0]);
    Debug.debugResize({ "width": canvas.width, "totalParticles": totalParticles, "impactRadius": impactRadius });

    if(mousePressed) {
        impact();
    } 

    particles.forEach(particle => {
        particle.update(dt);
        particle.draw();
    });

    requestAnimationFrame(update);
}

function configure() {
    if(canvas.width >= Config.RES_1920) {
        totalParticles = Config.NO_OF_PARTICLES_1920;
        impactRadius = Config.IMPACT_RADIUS;
    } else if(canvas.width >= Config.RES_820) {
        totalParticles = Config.NO_OF_PARTICLES_820;
        impactRadius = Config.IMPACT_RADIUS;
    } else {
        totalParticles = Config.NO_OF_PARTICLES_430;
        impactRadius = 30;
    }
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    configure(canvas.width);
    particles = []
    init();
});

function updateSpeed(particle) {
    if(particle.speedX > 0) {
        particle.speedX *= Config.X_DECELARATION;
        if(particle.speedX <= Config.X_TOLERANCE) {
            particle.speedX = 0;
        }
    }

    if(particle.speedY > particle.initialSpeedY) {
        particle.speedY *= Config.Y_DECELARATION;
        if(particle.speedY - particle.initialSpeedY <= Config.Y_TOLERANCE) {
            particle.speedY = particle.initialSpeedY;
        }
    }

}

function updateDirection(direction, target) {
    if(direction.x != target.x) {
        direction.x += (target.x - direction.x) * Config.INTERPOLATION_FACTOR;
    }

    if(direction.y != target.y) {
        direction.y += (target.y - direction.y) * Config.INTERPOLATION_FACTOR;
    }

}

function impact() {
    const rect = canvas.getBoundingClientRect();
    const x = mouseX - rect.left;
    const y = mouseY - rect.top;

    particles.forEach(particle => {
        const dispVec = Vec2d.displacement(new Vec2d(x,y), particle.coords.toVec2d());
    
        if(dispVec.magnitude <= impactRadius) {
            particle.direction = dispVec.getUnitVec();
            particle.speedX = Config.BURST_SPEED_X;
            particle.speedY = Config.BURST_SPEED_Y;
        }
    });
}

function updateMousePos(pos) {
    mouseX = pos.clientX;
    mouseY = pos.clientY;
}

document.addEventListener("mousedown", event => {
    mousePressed = true;
    updateMousePos(event);
    document.addEventListener("mousemove", updateMousePos);
});

document.addEventListener("mouseup", event => {
    mousePressed = false;
    document.removeEventListener("mousemove", updateMousePos);
});

document.addEventListener("touchstart", event => {
    mousePressed = true;
    updateMousePos(event.touches[0]);
    document.addEventListener("touchmove", (event) => updateMousePos(event.touches[0]));
});

document.addEventListener("touchend", event => {
    mousePressed = false;
    impact();
    document.removeEventListener("touchmove", (event) => updateMousePos(event.touches[0]));
});

document.addEventListener("DOMContentLoaded", () => {
    new Debug();
 });

init();
requestAnimationFrame(update);