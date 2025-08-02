const canvas = document.querySelector("canvas");

canvas.width = 800;
canvas.height = 600;

const ctx = canvas.getContext("2d");
const colors = ["#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce"];

class Circle {
  constructor() {
    this.radius = Math.random() * 100;
    this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
    this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
    this.velX = Math.random() * 16 - 8;
    this.velY = Math.random() * 16 - 8;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;

    if (this.x + this.radius > canvas.width || this.x - this.radius <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius <= 0) {
      this.velY = -this.velY;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.stroke();
    ctx.fill();
  }
}

let circles = [];

for (let i = 0; i <= 10; i++) {
  let circle = new Circle();
  circles.push(circle);
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i <= 10; i++) {
    circles[i].draw();
    circles[i].update();
  }
}

animate();
