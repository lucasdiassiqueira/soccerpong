const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const map = [
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,0,1],
  [1,0,1,0,1,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1],
];

let posX = 3.5, posY = 3.5;
let dirX = -1, dirY = 0;
let planeX = 0, planeY = 0.66;

const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function update(dt) {
  const speed = dt * 3;
  const rot = dt * 2;

  if (keys["w"]) {
    if (map[Math.floor(posY)][Math.floor(posX + dirX * speed)] === 0) posX += dirX * speed;
    if (map[Math.floor(posY + dirY * speed)][Math.floor(posX)] === 0) posY += dirY * speed;
  }
  if (keys["s"]) {
    if (map[Math.floor(posY)][Math.floor(posX - dirX * speed)] === 0) posX -= dirX * speed;
    if (map[Math.floor(posY - dirY * speed)][Math.floor(posX)] === 0) posY -= dirY * speed;
  }
  if (keys["a"]) rotate(-rot);
  if (keys["d"]) rotate(rot);
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
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = "#444"; // céu
  ctx.fillRect(0, 0, width, height / 2);
  ctx.fillStyle = "#111"; // chão
  ctx.fillRect(0, height / 2, width, height / 2);

  for (let x = 0; x < width; x++) {
    const cameraX = 2 * x / width - 1;
    const rayDirX = dirX + planeX * cameraX;
    const rayDirY = dirY + planeY * cameraX;

    let mapX = Math.floor(posX);
    let mapY = Math.floor(posY);

    const deltaDistX = Math.abs(1 / rayDirX);
    const deltaDistY = Math.abs(1 / rayDirY);
    let stepX, stepY;
    let sideDistX, sideDistY;

    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (posX - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - posX) * deltaDistX;
    }

    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (posY - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - posY) * deltaDistY;
    }

    let hit = 0;
    let side;

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
    if (side === 0)
      perpWallDist = (mapX - posX + (1 - stepX) / 2) / rayDirX;
    else
      perpWallDist = (mapY - posY + (1 - stepY) / 2) / rayDirY;

    const lineHeight = Math.floor(height / perpWallDist);
    const drawStart = -lineHeight / 2 + height / 2;
    const drawEnd = lineHeight / 2 + height / 2;

    ctx.strokeStyle = side ? "#993" : "#ff3";
    ctx.beginPath();
    ctx.moveTo(x, drawStart);
    ctx.lineTo(x, drawEnd);
    ctx.stroke();
  }
}

let lastTime = performance.now();
function loop(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
