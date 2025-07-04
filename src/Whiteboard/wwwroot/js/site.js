

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
let painting = false;
let x1 = 0;
let y1 = 0;

function startPosition(e) {
    painting = true;
    x1 = e.clientX - canvas.offsetLeft;
    y1 = e.clientY - canvas.offsetTop;
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);