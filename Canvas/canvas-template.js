const canvas = document.querySelector("canvas");

canvas.width = innerWidth / 2;
canvas.height = innerHeight / 2;

const ctx = canvas.getContext("2d");
const colors = ["#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce"];
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth / 2;
  canvas.height = innerHeight / 2;
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

class Object {
  constructor() {}

  update() {}

  draw() {}
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw objects
  // text("pixels", mouse.x, mouse.y);
  circle(mouse.x, mouse.y, 100, "black", "rgba(0,0,255,0.5");
  circle(mouse.x + 100, mouse.y, 100, "black", "rgba(0,255,255,0.5");
}

function init() {
  //init world
}

init();
animate();
