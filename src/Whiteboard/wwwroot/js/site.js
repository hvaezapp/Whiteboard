

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
let painting = false;
let x1 = 0;
let y1 = 0;

var fontColor = '#000000';
var fontSize = 12;


// colorPicker changed
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("change", function () {
    fontColor = this.value;
    refreshTool();
});


// fontSize changed
const fontSizeSelect = document.getElementById("fontSizeSelect");
fontSizeSelect.addEventListener("change", function () {
    fontSize = parseInt(this.value);
    refreshTool();
});


const refreshTool = () => {

    ctx.lineWidth = fontSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = fontColor;

}

// socket connection
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/board").build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});



connection.on("OnDrawingAsync", (x1, y1, x2, y2, fcolor, fsize) => {

    fontColor = fcolor;
    fontSize = fsize;

    refreshTool();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
});

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

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    connection.invoke("DrawingAsync", x1, y1, x, y , fontColor , fontSize)
        .catch(function (err) {
            return console.error(err.toString());
        });

    x1 = x;
    y1 = y;
}

refreshTool();

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

