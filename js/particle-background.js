const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const NO_OF_PARTICLES = 800;
let lastTime = document.timeline.currentTime;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = []

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.2;
        this.speedY = Math.random() * 0.1;
        this.color = "rgba(255, 255, 255, 0.7)";
    }

    update(dt) {
        this.y += dt * this.speedY;
        if(this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for(let i = 0; i < NO_OF_PARTICLES; ++i) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function update(t) {
    const dt = (t - lastTime);
    lastTime = t;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

init();
requestAnimationFrame(update);