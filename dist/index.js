"use strict";
let gridSize = 32;
let currentColor = '#000000';
let isDrawing = false;
let currentTool = 'pencil';
let pixels = [];
const gridContainer = document.getElementById('gridContainer');
const setupDiv = document.getElementById('setup');
const Toolbar = document.getElementById('toolbar');
const createBtn = document.getElementById('createBtn');
const gridSizeInput = document.getElementById('gridSize');
const colorPicker = document.getElementById('colorPicker');
const currentColorDiv = document.getElementById('currentColor');
const pencilBtn = document.getElementById('pencilBtn');
const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');
const newBtn = document.getElementById('newBtn');
const sizeDisplay = document.getElementById('sizeDisplay');
function createGrid(size) {
    gridContainer.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    pixels = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const pixel = document.createElement('div');
            // Mouse events
            pixel.addEventListener('mousedown', (e) => {
                isDrawing = true;
                paintPixel(pixel);
            });
            pixel.addEventListener('mouseenter', () => {
                if (isDrawing) {
                    paintPixel(pixel);
                }
            });
            pixel.addEventListener('mouseup', () => isDrawing = false);
            pixel.addEventListener('mouseleave', () => { });
            // Touch support
            pixel.addEventListener('touchstart', (e) => {
                e.preventDefault();
                isDrawing = true;
                paintPixel(pixel);
            });
            pixel.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (isDrawing) {
                    const touch = e.touches[0];
                    const element = document.elementFromPoint(touch.clientX, touch.clientY);
                    if (element && element.classList.contains('grid') === false) {
                        paintPixel(element);
                    }
                }
            });
            grid.appendChild(pixel);
            row.push(pixel);
        }
        pixels.push(row);
    }
    gridContainer.appendChild(grid);
    // Global mouse up
    document.addEventListener('mouseup', () => isDrawing = false);
}
function paintPixel(pixel) {
    if (currentTool === 'pencil') {
        pixel.style.backgroundColor = currentColor;
    }
    else {
        pixel.style.backgroundColor = 'white';
    }
}
function setTool(tool) {
    currentTool = tool;
    pencilBtn.classList.toggle('active', tool === 'pencil');
    eraserBtn.classList.toggle('active', tool === 'eraser');
}
// Event Listeners
createBtn.addEventListener('click', () => {
    const size = parseInt(gridSizeInput.value);
    if (size < 8 || size > 64) {
        alert("Please enter a size between 8 and 64");
        return;
    }
    gridSize = size;
    sizeDisplay.textContent = `${size}×${size}`;
    setupDiv.classList.add('hidden');
    Toolbar.classList.remove('hidden');
    createGrid(size);
});
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    currentColorDiv.style.backgroundColor = currentColor;
});
pencilBtn.addEventListener('click', () => setTool('pencil'));
eraserBtn.addEventListener('click', () => setTool('eraser'));
clearBtn.addEventListener('click', () => {
    if (confirm("Clear the entire grid?")) {
        pixels.forEach(row => {
            row.forEach(pixel => {
                pixel.style.backgroundColor = 'white';
            });
        });
    }
});
exportBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const pixelSize = 20; // Match CSS size
    canvas.width = gridSize * pixelSize;
    canvas.height = gridSize * pixelSize;
    pixels.forEach((row, y) => {
        row.forEach((pixel, x) => {
            ctx.fillStyle = pixel.style.backgroundColor || '#ffffff';
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        });
    });
    const link = document.createElement('a');
    link.download = `pixel-art-${gridSize}x${gridSize}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});
newBtn.addEventListener('click', () => {
    if (confirm("Create a new grid? Current art will be lost.")) {
        setupDiv.classList.remove('hidden');
        Toolbar.classList.add('hidden');
        gridContainer.innerHTML = '';
    }
});
// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'e' || e.key === 'E') {
        setTool('eraser');
    }
    if (e.key === 'p' || e.key === 'P') {
        setTool('pencil');
    }
    if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        clearBtn.click();
    }
});
// Initialize
currentColorDiv.style.backgroundColor = currentColor;
