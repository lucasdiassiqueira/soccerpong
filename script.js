const car = document.getElementById('car');
const parkingSpot = document.getElementById('parkingSpot');
const message = document.getElementById('message');

let posX = 50;
let posY = 300;
let angle = 0;
let speed = 3;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') {
    posY -= speed;
  } else if (e.key === 'ArrowDown' || e.key === 's') {
    posY += speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'a') {
    posX -= speed;
    angle = -10;
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    posX += speed;
    angle = 10;
  }

  // Atualiza posição e rotação
  car.style.left = `${posX}px`;
  car.style.top = `${posY}px`;
  car.style.transform = `rotate(${angle}deg)`;

  // Verifica colisão com a vaga
  checkParking();
});

function checkParking() {
  const carRect = car.getBoundingClientRect();
  const spotRect = parkingSpot.getBoundingClientRect();

  if (
    carRect.left < spotRect.right &&
    carRect.right > spotRect.left &&
    carRect.top < spotRect.bottom &&
    carRect.bottom > spotRect.top
  ) {
    message.textContent = "✅ Você estacionou!";
  } else {
    message.textContent = "";
  }
}
