document.addEventListener('DOMContentLoaded', function () {
  generateTableCells();
  drawLShape();
  generateSpecificShapes();

  const showSpoilerButton = document.getElementById('showSpoilerButton');
  showSpoilerButton.addEventListener('click', toggleSpoilerImage);

  cells = document.querySelectorAll('.block');

  const shapes = document.querySelectorAll('.shape');
  shapes.forEach(shape => {
    shape.addEventListener('dragstart', dragStart);
  });

  const table = document.querySelector('.table');
  table.addEventListener('dragover', dragOver);
  table.addEventListener('drop', drop);
});

let isSpoilerShown = false;
let spoilerImage; 

function toggleSpoilerImage() {
  const button = this;

  if (!isSpoilerShown) {
    spoilerImage = new Image();
    spoilerImage.src = './img/Spoiler.png';
    spoilerImage.id = 'spoilerImage'; 

    const spoilerImageContainer = document.getElementById('spoilerImageContainer');
    spoilerImageContainer.appendChild(spoilerImage);

    button.textContent = 'Spoiler kép eltüntetése';
    isSpoilerShown = true;
  } else {
    spoilerImage.remove();
    button.textContent = 'Spoiler kép megjelenítése';
    isSpoilerShown = false;
  }
}
let draggedItem; 

function dragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
  draggedItem = event.target;

  const offsetXFromMouse = event.offsetX;
  const offsetYFromMouse = event.offsetY;

  event.dataTransfer.setData('offsetXFromMouse', offsetXFromMouse);
  event.dataTransfer.setData('offsetYFromMouse', offsetYFromMouse);
}


function dragOver(event) {

  event.preventDefault();
}

const shapesData = [
    
  { width: 50, height: 200 },  // 1x4 egység
  { width: 50, height: 300 },  // 1x6 egység
  { width: 50, height: 250 },  // 1x5 egység
  { width: 50, height: 250 },  // 1x5 egység
  { width: 100, height: 250 },  // 1x5 egység
  { width: 50, height: 50 },   // 1x1 egység
  { width: 100, height: 100 }, // 2x2 egység
  { width: 100, height: 150 }, // 2x3 egység
  { width: 150, height: 200 }, // 3x4 egység
  { width: 150, height: 150 }, // 3x3 egység
  { width: 150, height: 150 }, // 3x3 egység
  { width: 150, height: 150 }, // 3x3 egység
  { width: 100, height: 200 }, // 2x4 egység
  { width: 100, height: 200 }  // 2x4 egység
];

function canPlaceShape(tableCells, touchedCells) {
  for (const index of touchedCells) {
    if (tableCells[index].style.backgroundColor) {
      return false;
    }
  }
  return true;
}

function rotateShape(event) {
  const clickedElementId = event.target.id;
  const clickedElement = document.getElementById(clickedElementId);

  
  const currentWidth = parseInt(clickedElement.style.width);
  const currentHeight = parseInt(clickedElement.style.height);

  
  clickedElement.style.width = `${currentHeight}px`;
  clickedElement.style.height = `${currentWidth}px`;

  
  clickedElement.dataset.rotatedWidth = `${currentHeight}`;
  clickedElement.dataset.rotatedHeight = `${currentWidth}`;
}

function drop(event) {
  event.preventDefault();
  const droppedItemId = event.dataTransfer.getData('text/plain');
  const droppedItem = document.getElementById(droppedItemId);
  console.log(droppedItem);

  if (!droppedItem) return;

  const tableCells = Array.from(document.querySelectorAll('.block'));
  const tableWidth = 10;

  const cellId = event.target.id;
  console.log(cellId);
  const cellX = parseInt(cellId.split('_')[1]) % tableWidth;
  const cellY = Math.floor(parseInt(cellId.split('_')[1]) / tableWidth);
  console.log("Cella X: "+cellX);
  console.log("Cella Y: "+cellY);

  const shapeIndex = parseInt(droppedItem.id.split('_')[1]);
  const shapeData = shapesData[shapeIndex];

  const shapeWidth = parseInt(droppedItem.dataset.rotatedWidth || shapeData.width) / 50; 
  const shapeHeight = parseInt(droppedItem.dataset.rotatedHeight || shapeData.height) / 50;



  const touchedCells = new Set();

  for (let x = 0; x < shapeWidth; x++) {
    for (let y = 0; y < shapeHeight; y++) {
      const blockX = cellX + x;
      const blockY = cellY + y;
      console.log(blockX);
      console.log(blockY);

      if (blockX < 0 || blockX >= tableWidth || blockY < 0 || blockY >= tableWidth) {
        alert('Az alakzat részei nem lehetnek a tábla határain kívül!');
        return;
      }
      const index = blockX + blockY * tableWidth;
      const roundedIndex = Math.floor(index)
      touchedCells.add(roundedIndex);
      
    }
  }

  const canPlace = canPlaceShape(tableCells, touchedCells);
  if (!canPlace) {
    alert('Nem helyezheted el az alakzatot itt!');
    return;
  }


  tableCells.forEach((cell, index) => {
    if (touchedCells.has(index)) {
      cell.style.backgroundColor = droppedItem.style.backgroundColor;
    }
  });

  droppedItem.remove();
  if (checkAllShapesPlaced()) {
    setTimeout(function() {
      alert('Gratulálok, minden alakzatot elhelyeztél!');
    }, 500);
  }
}

function generateTableCells() {
  const table = document.querySelector('.table');
  table.addEventListener('dragover', dragOver);
  table.addEventListener('drop', drop);
  for (let i = 0; i < 100; i++) { 
    const cell = document.createElement('div');
    cell.classList.add('block');
    cell.setAttribute('id', 'block_' + i); 
    table.appendChild(cell);
  }
}

function drawLShape() {
  const table = document.querySelector('.table');
  const cells = table.querySelectorAll('.block');

  const lShapeCoordinates = [
    { x: 4, y: 5 },
    { x: 4, y: 4 },
    { x: 4, y: 3 },
    { x: 5, y: 3 }
  ];

  const tableWidth = 10; 

  lShapeCoordinates.forEach(coord => {
    const index = coord.x + coord.y * tableWidth;
    if (index < cells.length) {
      cells[index].style.backgroundColor = 'black'; 
    }
  });
}

function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  let isBlackOrWhite = true;

  while (isBlackOrWhite) {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
 
    isBlackOrWhite = color === '#000000' || color === '#FFFFFF';
  }
  return color;
}

function checkAllShapesPlaced() {
  const tableCells = document.querySelectorAll('.block');
  for (const cell of tableCells) {
    if (!cell.style.backgroundColor) {
      return false; 
    }
  }
  return true; 
}

function generateSpecificShapes() {
  const shapesContainer = document.querySelector('.shapes-container');
  shapesData.sort(() => Math.random() - 0.5);

  const usedColors = new Set(); 

  shapesData.forEach((shapeData, index) => {
    const shape = document.createElement('div');
    shape.classList.add('shape');
    shape.setAttribute('id', 'shape_' + index);
    shape.style.width = shapeData.width + 'px';
    shape.style.height = shapeData.height + 'px';

    let color = generateRandomColor();
    while (usedColors.has(color)) {
      color = generateRandomColor();
    }
    usedColors.add(color);
    
    shape.style.backgroundColor = color;
    shape.setAttribute('draggable', true);
    shape.addEventListener('dragstart', dragStart);
    shape.addEventListener('click', rotateShape);
    shapesContainer.appendChild(shape);
  });
}
