"use strict";
const canvas = document.getElementById("projectCanvas");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
const ctx = canvas.getContext("2d");
//CONSTANTS
//Screen and bacground 
const ARENA_WIDTH = 100;
const ARENA_HEIGHT = 100;
const SCREEN_HEIGHT_OCCUPANCY = 0.8;
const SCREEN_WIDTH_OCCUPANCY = 0.8;
const BACKGROUND_COLOR = "black";
const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;
//Entities
const PARTICLE_COUNT = 100;
const PARTICLE_RADIUS = 1;
const PARTICLE_COLOR = "red";
// Early calculation
const ARENA_WIDTH_PIXELS = SCREEN_WIDTH * SCREEN_WIDTH_OCCUPANCY;
const ARENA_HEIGHT_PIXELS = SCREEN_HEIGHT * SCREEN_HEIGHT_OCCUPANCY;
const ARENA_DX = ARENA_WIDTH_PIXELS / ARENA_WIDTH;
const ARENA_DY = ARENA_HEIGHT_PIXELS / ARENA_HEIGHT;
// Classes
class Particle {
    constructor(x, y, vx, vy, radius, color, ctx) {
        this.handleBoundary = () => {
            if (this.x < this.radius) {
                this.vx = -this.vx;
                this.x = this.radius;
            }
            if (this.x > ARENA_WIDTH_PIXELS - this.radius) {
                this.vx = -this.vx;
                this.x = ARENA_WIDTH_PIXELS - this.radius;
            }
            if (this.y < this.radius) {
                this.vy = -this.vy;
                this.y = this.radius;
            }
            if (this.y > ARENA_HEIGHT_PIXELS - this.radius) {
                this.vy = -this.vy;
                this.y = ARENA_HEIGHT_PIXELS - this.radius;
            }
        };
        this.move = (dt) => {
            this.x += this.vx * dt / 2;
            this.y += this.vy * dt / 2;
            this.vx += this.ax * dt;
            this.vy += this.ay * dt;
            this.x += this.vx * dt / 2;
            this.y += this.vy * dt / 2;
            this.handleBoundary();
        };
        this.draw = () => {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        };
        this.handleCollision = (other) => {
            //TODO
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
