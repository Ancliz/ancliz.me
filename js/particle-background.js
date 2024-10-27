"use strict"

import { Point, Vec2d } from "./Vec2d.js";
import { rand } from "./util.js";
import Config from "./background-config.js";
import Debug from "./debug.js";

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let lastTime = document.timeline.currentTime;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = []

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
        
        if(this.coords.y > canvas.height) {
            this.coords.y = 0;
            this.coords.x = Math.random() * canvas.width;
        }
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
    for(let i = 0; i < Config.NO_OF_PARTICLES_1920; ++i) {
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
    
    particles.forEach(particle => {
        particle.update(dt);
        particle.draw();
    });

    requestAnimationFrame(update);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

document.addEventListener("click", event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    particles.forEach(particle => {
        const dispVec = Vec2d.displacement(new Vec2d(x,y), particle.coords.toVec2d());
    
        if(dispVec.magnitude <= Config.IMPACT_RADIUS) {
            particle.direction = dispVec.getUnitVec();
            particle.speedX = Config.BURST_SPEED_X;
            particle.speedY = Config.BURST_SPEED_Y;
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    new Debug();
 });

init();
requestAnimationFrame(update);