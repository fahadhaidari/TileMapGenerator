window.onload = function() {
  const map = [];
  let data = null;
  let mouseX = 0;
  let mouseY = 0;
  let isMouseDown = false;
  let drawMode = "draw";

  const canvas = document.createElement('canvas');
  const a = document.createElement('a');
  const colorPicker = document.createElement('input');
  const context = canvas.getContext('2d');

  colorPicker.setAttribute("type", "color");

  canvas.width = GRID_WIDTH * TILE_SIZE;
  canvas.height = GRID_HEIGHT * TILE_SIZE;

  document.body.appendChild(canvas);
  document.body.appendChild(colorPicker);
  document.body.appendChild(a);

  document.body.addEventListener('keyup', ({ keyCode }) => {
    if (keyCode === 69) { drawMode = "erase"; } // e

    if (keyCode === 68) { drawMode = "draw"; } // d
  });

  document.body.addEventListener('mousedown', (e) => {
    if (e.target.type === 'color') return;

    isMouseDown = true;
  });

  document.body.addEventListener('mousemove', ({ offsetX, offsetY }) => {
    mouseX = offsetX;
    mouseY = offsetY;
  });

  document.body.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  const findModular = (p) => p - (p % TILE_SIZE);

  const draw = function(tile, color = undefined) {
    context.fillStyle = tile.color;
    context.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
    context.stroke();
  }

  const drawGrid = function() {
    let i = 0;
    let j = 0;

    for (i = 0; i < GRID_HEIGHT; i ++) {
      for (j = 0; j < GRID_WIDTH; j ++) {
        context.strokeStyle = GRID_COLOR;
        context.strokeRect(j * (TILE_SIZE), i * (TILE_SIZE), TILE_SIZE, TILE_SIZE);
        context.stroke();
      }
    }
  }

  const update = function() {
    if (isMouseDown) {
      const xVal = findModular(mouseX);
      const yVal = findModular(mouseY);
      const id = xVal + '-' + yVal;

      if (!findTile(id)) {
        const tile = {
          id,
          TILE_SIZE,
          x: xVal,
          y: yVal,
          color: colorPicker.value
        };

        a.href = 'data:' + data;
        a.download = 'map.json';
        a.innerHTML = 'EXPORT MAP AS JSON';

        map.push(tile);
        data = "text/json;charset=utf-8,map=" + encodeURIComponent(JSON.stringify(map));

        draw(tile);
      }

      if (drawMode === "erase") {
        const tile = findTile(id);

        if (tile) {
          map.splice(tile.index, 1);
          context.clearRect(xVal, yVal, TILE_SIZE, TILE_SIZE);
        }
        return;
      } else {
        return
      }
    }
    drawGrid();
  }

  const findTile = function(id) {
    for (let i in map) {
      if (id === map[i].id) {
        return {
          id,
          index: i,
        };
      }
    }
  }

  const frame = function() {
    update();
    requestAnimationFrame(frame);
  }

  frame();
}
