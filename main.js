"use strict";
const canvas = document.getElementById("projectCanvas");
const info = document.getElementById("info");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
const ctx = canvas.getContext("2d");
//CONSTANTS
//Screen and background
const ARENA_WIDTH = 70;
const ARENA_HEIGHT = 70;
const SCREEN_HEIGHT_OCCUPANCY = 0.7;
const SCREEN_WIDTH_OCCUPANCY = 0.8;
const BACKGROUND_COLOR = "black";
const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;
const CALC_TO_DISPLAY_RATIO = 5;
//Universe
const GRAVITY = 100;
const dt = 1 / 1000;
const EPSILON = 0.0001;
//Entities
const PARTICLE_COUNT = 2500;
const PARTICLE_RADIUS = 5.6;
const PARTICLE_COLOR = "red";
const PARTICLE_VELOCITY = 150;
// Early calculation
const ARENA_WIDTH_PIXELS = SCREEN_WIDTH * SCREEN_WIDTH_OCCUPANCY;
const ARENA_HEIGHT_PIXELS = SCREEN_HEIGHT * SCREEN_HEIGHT_OCCUPANCY;
const ARENA_DX = ARENA_WIDTH_PIXELS / ARENA_WIDTH;
const ARENA_DY = ARENA_HEIGHT_PIXELS / ARENA_HEIGHT;
const ARENA_X_OFFSET = (SCREEN_WIDTH - ARENA_WIDTH_PIXELS) / 2;
const ARENA_Y_OFFSET = (SCREEN_HEIGHT - ARENA_HEIGHT_PIXELS) / 2;
let time = performance.now();
let timeTaken = 0;
// Classes
class Particle {
    constructor(x, y, vx, vy, radius, color, ctx) {
        this.handleBoundary = () => {
            if (this.x < this.radius + ARENA_X_OFFSET) {
                this.vx = -this.vx;
                this.x = this.radius + ARENA_X_OFFSET;
            }
            if (this.x > ARENA_WIDTH_PIXELS - this.radius + ARENA_X_OFFSET) {
                this.vx = -this.vx;
                this.x = ARENA_WIDTH_PIXELS - this.radius + ARENA_X_OFFSET;
            }
            if (this.y < this.radius + ARENA_Y_OFFSET) {
                this.vy = -this.vy;
                this.y = this.radius + ARENA_Y_OFFSET;
            }
            if (this.y > ARENA_HEIGHT_PIXELS - this.radius + ARENA_Y_OFFSET) {
                this.vy = -this.vy;
                this.y = ARENA_HEIGHT_PIXELS - this.radius + ARENA_Y_OFFSET;
            }
        };
        this.move = (dt) => {
            this.x += (this.vx * dt) / 2;
            this.y += (this.vy * dt) / 2;
            this.vx += this.ax * dt;
            this.vy += this.ay * dt;
            this.x += (this.vx * dt) / 2;
            this.y += (this.vy * dt) / 2;
            this.handleBoundary();
        };
        this.draw = () => {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        };
        this.handleCollision = (other) => {
            if (other === this)
                return;
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distance_squared = dx * dx + dy * dy;
            if (distance_squared < 4 * this.radius * this.radius + 0) {
                const distance = Math.sqrt(distance_squared);
                const nx = dx / distance;
                const ny = dy / distance;
                const average_vx = (this.vx + other.vx) / 2;
                const average_vy = (this.vy + other.vy) / 2;
                const dot_product = nx * (this.vx - other.vx) + ny * (this.vy - other.vy);
                this.vx -= 1 * dot_product * nx;
                this.vy -= 1 * dot_product * ny;
                other.vx += 1 * dot_product * nx;
                other.vy += 1 * dot_product * ny;
                this.x -= (nx * (2 * this.radius - distance)) / 2;
                this.y -= (ny * (2 * this.radius - distance)) / 2;
                other.x += (nx * (2 * this.radius - distance)) / 2;
                other.y += (ny * (2 * this.radius - distance)) / 2;
            }
        };
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.ax = 0;
        this.ay = 0;
        this.ctx = ctx;
    }
}
// Particle handling functions
const addGravity = (particles) => {
    for (let i = 0; i < particles.length; i++) {
        particles[i].ay = GRAVITY;
    }
};
const moveParticles = (particles, dt) => {
    addGravity(particles);
    for (let i = 0; i < particles.length; i++) {
        particles[i].move(dt);
    }
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            particles[i].handleCollision(particles[j]);
        }
    }
};
const drawParticles = (particles) => {
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
};
// Core engine
const initiate = () => {
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = (SCREEN_WIDTH - ARENA_WIDTH_PIXELS) / 2 +
            Math.random() * ARENA_WIDTH_PIXELS;
        const y = (SCREEN_HEIGHT * (1 - SCREEN_HEIGHT_OCCUPANCY)) / 2 +
            Math.random() * ARENA_HEIGHT_PIXELS;
        const vx = Math.random() * PARTICLE_VELOCITY - PARTICLE_VELOCITY / 2;
        const vy = Math.random() * PARTICLE_VELOCITY - PARTICLE_VELOCITY / 2;
        particles.push(new Particle(x, y, vx, vy, PARTICLE_RADIUS, PARTICLE_COLOR, ctx));
    }
    setInterval(FrameRateUpdater, 200);
    main(particles);
};
const main = (particles) => {
    const new_time = performance.now();
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    for (let i = 0; i < CALC_TO_DISPLAY_RATIO; i++) {
        moveParticles(particles, dt);
    }
    drawParticles(particles);
    timeTaken = new_time - time;
    time = new_time;
    window.requestAnimationFrame(() => main(particles));
};
const FrameRateUpdater = () => {
    info.innerHTML = `Frame rate: ${(1000 / timeTaken).toFixed(2)}FPS`;
};
initiate();
