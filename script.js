const car = document.getElementById('car');
const message = document.getElementById('message');
const parkingSpot = document.getElementById('parkingSpot');
const otherCars = document.querySelectorAll('.other-car');

let posX = 50;
let posY = 300;
let angle = 0;
let speed = 0;
let maxSpeed = 2;
let accel = 0.1;
let rotationSpeed = 2;
let keys = {};
let crashed = false;

document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function gameLoop() {
  if (!crashed) {
    if (keys['arrowup'] || keys['w']) {
      speed = Math.min(speed + accel, maxSpeed);
    } else if (keys['arrowdown'] || keys['s']) {
      speed = Math.max(speed - accel, -maxSpeed);
    } else {
      speed *= 0.98;
    }

    if ((keys['arrowleft'] || keys['a']) && speed !== 0) {
      angle -= rotationSpeed * (speed > 0 ? 1 : -1);
    }
    if ((keys['arrowright'] || keys['d']) && speed !== 0) {
      angle += rotationSpeed * (speed > 0 ? 1 : -1);
    }

    posX += Math.sin(angle * Math.PI / 180) * speed;
    posY -= Math.cos(angle * Math.PI / 180) * speed;

    car.style.left = `${posX}px`;
    car.style.top = `${posY}px`;
    car.style.transform = `rotate(${angle}deg)`;

    checkParking();
    checkCollision();
  }

  requestAnimationFrame(gameLoop);
}

function checkParking() {
  const carRect = car.getBoundingClientRect();
  const spotRect = parkingSpot.getBoundingClientRect();

  const nearX = Math.abs(carRect.left - spotRect.left) < 10;
  const nearY = Math.abs(carRect.top - spotRect.top) < 10;
  const aligned = Math.abs((angle % 360)) < 15;

  if (nearX && nearY && aligned && Math.abs(speed) < 0.3) {
    message.textContent = "✅ Você estacionou com sucesso!";
    speed = 0;
  }
}

function checkCollision() {
  const carRect = car.getBoundingClientRect();

  otherCars.forEach(other => {
    const otherRect = other.getBoundingClientRect();

    const overlap = !(
      carRect.right < otherRect.left ||
      carRect.left > otherRect.right ||
      carRect.bottom < otherRect.top ||
      carRect.top > otherRect.bottom
    );

    if (overlap) {
      message.textContent = "❌ Você bateu! Reinicie a página.";
      speed = 0;
      crashed = true;
    }
  });
}

gameLoop();
