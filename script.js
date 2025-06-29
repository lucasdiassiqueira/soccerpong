const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Mapa (1 = parede, 0 = vazio)
const map = [
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,0,1],
  [1,0,1,0,1,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1],
];

const mapWidth = map[0].length;
const mapHeight = map.length;
const tileSize = 64;

let posX = 3.5, posY = 3.5; // Posição do jogador
let dirX = -1, dirY = 0; // Direção
let planeX = 0, planeY = 0.66; // Câmera

const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function update(deltaTime) {
  const moveSpeed = deltaTime * 3;
  const rotSpeed = deltaTime * 2;

  // Movimento frente/tras
  if (keys['w']) {
    if (map[Math.floor(posY)][Math.floor(posX + dirX * moveSpeed)] === 0) posX += dirX * moveSpeed;
    if (map[Math.floor(posY + dirY * moveSpeed)][Math.floor(posX)] === 0) posY += dirY * moveSpeed;
  }
  if (keys['s']) {
    if (map[Math.floor(posY)][Math.floor(posX - dirX * moveSpeed)] === 0) posX -= dirX * moveSpeed;
    if (map[Math.floor(posY - dirY * moveSpeed)][Math.floor(posX)] === 0) posY -= dirY * moveSpeed;
  }

  // Rotação esquerda/direita
  if (keys['a']) rotate(-rotSpeed);
  if (keys['d']) rotate(rotSpeed);
}

function rotate(angle) {
  const oldDirX = dirX;
  dirX = dirX * Math.cos(angle) - dirY * Math.sin(angle);
  dirY = oldDirX * Math.sin(angle) + dirY * Math.cos(angle);
  const oldPlaneX = planeX;
  planeX = planeX * Math.cos(angle) - planeY * Math.sin(angle);
  planeY = oldPlaneX * Math.sin(angle) + planeY * Math.cos(angle);
}

function draw() {
  for (let x = 0; x < canvas.width; x++) {
    const cameraX = 2 * x / canvas.width - 1;
    const rayDirX = dirX + planeX * cameraX;
    const rayDirY = dirY + planeY * cameraX;

    let mapX = Math.floor(posX);
    let mapY = Math.floor(posY);

    const deltaDistX = Math.abs(1 / rayDirX);
    const deltaDistY = Math.abs(1 / rayDirY);
    let sideDistX, sideDistY;

    let stepX, stepY;
    let hit = 0, side;

    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (posX - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1.0 - posX) * deltaDistX;
    }
    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (posY - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1.0 - posY) * deltaDistY;
    }

    while (hit === 0) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      if (map[mapY][mapX] > 0) hit = 1;
    }

    let perpWallDist;
    if (side === 0) {
      perpWallDist = (mapX - posX + (1 - stepX) / 2) / rayDirX;
    } else {
      perpWallDist = (mapY - posY + (1 - stepY) / 2) / rayDirY;
    }

    const lineHeight = Math.floor(canvas.height / perpWallDist);
    const drawStart = Math.max(0, -lineHeight / 2 + canvas.height / 2);
    const drawEnd = Math.min(canvas.height, lineHeight / 2 + canvas.height / 2);

    ctx.fillStyle = side === 1 ? '#884' : '#cc0';
    ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
  }
}

let lastTime = 0;
function gameLoop(time) {
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  update(deltaTime);
  ctx.fillStyle = '#444'; // teto
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
  ctx.fillStyle = '#222'; // chão
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
  draw();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
