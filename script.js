const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Carro
const car = {
  x: 300,
  y: 300,
  angle: 0,
  speed: 0,
  width: 20,
  height: 40,
  maxSpeed: 3,
  accel: 0.1,
  friction: 0.05,
  turnSpeed: 3
};

// Teclas
const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Update lógica
function update() {
  // aceleração
  if (keys['w'] || keys['arrowup']) car.speed += car.accel;
  if (keys['s'] || keys['arrowdown']) car.speed -= car.accel;

  // limitar velocidade
  if (car.speed > car.maxSpeed) car.speed = car.maxSpeed;
  if (car.speed < -car.maxSpeed / 2) car.speed = -car.maxSpeed / 2;

  // rotação
  if ((keys['a'] || keys['arrowleft']) && car.speed !== 0) car.angle -= car.turnSpeed * Math.sign(car.speed);
  if ((keys['d'] || keys['arrowright']) && car.speed !== 0) car.angle += car.turnSpeed * Math.sign(car.speed);

  // fricção
  if (car.speed > 0) car.speed -= car.friction;
  if (car.speed < 0) car.speed += car.friction;
  if (Math.abs(car.speed) < car.friction) car.speed = 0;

  // mover
  car.x += Math.sin(toRad(car.angle)) * car.speed;
  car.y -= Math.cos(toRad(car.angle)) * car.speed;

  // limites da pista
  if (car.x < 0) car.x = 0;
  if (car.y < 0) car.y = 0;
  if (car.x > canvas.width) car.x = canvas.width;
  if (car.y > canvas.height) car.y = canvas.height;
}

function toRad(deg) {
  return deg * Math.PI / 180;
}

// Desenhar carro e pista
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // pista (simples)
  ctx.fillStyle = "#222";
  ctx.fillRect(100, 50, 400, 300);
  ctx.strokeStyle = "#fff";
  ctx.setLineDash([10, 10]);
  ctx.strokeRect(100, 50, 400, 300);
  ctx.setLineDash([]);

  // carro
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(toRad(car.angle));
  ctx.fillStyle = "red";
  ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
  ctx.restore();
}
