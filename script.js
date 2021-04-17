// Canvas Setup
const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;

ctx.font = "40px Georgia";

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};

canvas.addEventListener("mousedown", (ev) => {
  mouse.click = true;
  mouse.x = ev.x - canvasPosition.left;
  mouse.y = ev.y - canvasPosition.top;
});

canvas.addEventListener("mouseup", () => {
  mouse.click = false;
});

// Player
class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height;

    this.radius = 50;
    this.angle = 0;

    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;

    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }

  update() {
    const distanceX = this.x - mouse.x;
    const distanceY = this.y - mouse.y;

    if (mouse.x !== this.x) {
      this.x -= distanceX / 30;
    }

    if (mouse.y !== this.y) {
      this.y -= distanceY / 30;
    }
  }

  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

const player = new Player();

// Bubbles
let bubbles = [];

class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;

    this.radius = 30;
    this.speed = Math.random() * 5 + 1;
    this.distance;

    this.touched = false;
    this.sound = Math.random() <= 0.5 ? true : false;
  }

  update() {
    this.y -= this.speed;

    const distanceX = this.x - player.x;
    const distanceY = this.y - player.y;
    this.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

const bubblePop1 = document.createElement("audio");
bubblePop1.src = "sounds/bubbles-single1.wav";

const bubblePop2 = document.createElement("audio");
bubblePop2.src = "sounds/plop.ogg";

const handleBubbles = () => {
  if (gameFrame % 50 === 0) {
    bubbles = [...bubbles, new Bubble()];
  }

  for (const B of bubbles) {
    B.update();
    B.draw();
  }

  // remove bubbles that reach the top in separate loop
  // this stops rest of the bubbles from blinking - not sure why
  for (const [i, B] of bubbles.entries()) {
    B.y < 0 - this.radius * 2 && bubbles.splice(i, 1);

    // collision detection
    if (B.distance < B.radius + player.radius) {
      !B.touched && B.sound && bubblePop1.play();
      !B.touched && !B.sound && bubblePop2.play();

      !B.touched && score++;
      B.touched = true;

      bubbles.splice(i, 1);
    }
  }
};

// Animation Loop
const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleBubbles();

  player.update();
  player.draw();

  ctx.fillStyle = "black";
  ctx.fillText(`score: ${score}`, 10, 40);
  gameFrame++;

  requestAnimationFrame(animate);
};

animate();
