const canvas = document.querySelector("canvas");

const customWidth = 1200;
const customHeight = 800;

canvas.width = customWidth;
canvas.height = customHeight;

const ctx = canvas.getContext("2d");
const colors = ["#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce"];
const mouse = {
  x: customWidth,
  y: customHeight,
};

addEventListener("resize", () => {
  canvas.width = customWidth / 2;
  canvas.height = customHeight / 2;
});

addEventListener("click", () => {
  for (let i = 0; i < 20; i++) {
    balls[i].explode();
  }
});

function text(text, x, y) {
  ctx.fillText(text, x, y);
}

function line(x1, y1, x2, y2, color = "red") {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function circle(x, y, radius, color = "red", fill = "blue") {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.stroke();
  ctx.fill();
}

function random(m, n) {
  return Math.random() * (n - m) + m;
}

class Ball {
  constructor(x, y, r, dx, dy) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;
    this.grav = 1;
    this.color = colors[Math.floor(random(0, 5))];
  }

  update() {
    this.y += this.dy;
    this.x += this.dx;

    if (this.y + this.r > customHeight) {
      this.dy = -this.dy * 0.8;
      this.dx = this.dx * 0.8;
      this.y = customHeight - this.r;
    }

    this.dy += this.grav;

    if (this.x + this.r > customWidth || this.x - this.r < 0) {
      this.dx = -this.dx;
    }
  }

  explode() {
    this.dx += random(-8, 8);

    if (this.dy >= 0) {
      this.dy += random(0, 30);
    } else {
      this.dy -= random(0, 30);
    }
  }

  draw() {
    circle(this.x, this.y, this.r, "black", this.color);
  }
}

const balls = [];

function init() {
  for (let i = 0; i < 20; i++) {
    let r = random(10, 50);
    let x = random(r, customWidth - r);
    let y = random(0, customHeight);
    let dx = random(-8, 8);

    balls.push(new Ball(x / 2, y, r, dx, 1));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // update and draw objects
  for (let i = 0; i < 20; i++) {
    balls[i].draw();
    balls[i].update();
  }
}

init();
animate();
