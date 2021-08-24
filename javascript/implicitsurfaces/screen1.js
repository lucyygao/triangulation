var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var select = selectlayer.getContext('2d');
var coordinates = [];
var drawing = false;
var selecting = false;
var wasoutside = false;
var drawxmax = 0;
var drawxmin = 0;
var allcoords = [];
var selected = [];
var timer = 0;
var prevlen = 0;

// 800 x 400 x 800 - divide all by 8
function initialize() {
    allcoords = Array(100).fill().map(() => Array(50).fill().map(() => Array(100).fill(0)));
}

function clicked(e) {
    if (!outside(e)) {
        drawing = true;
        var rectangle = canvas.getBoundingClientRect();
        var x = e.clientX - rectangle.left;
        var y = e.clientY - rectangle.top;
        coordinates.push([x, y]);
        // for (var k = 0; k < 100; k++) {
        //     allcoords[Math.floor(x/8)][Math.floor(y/8)][k] += 5;
        // }
        ctx.moveTo(x, y);
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'blueviolet';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function outside(e) {
    var rectangle = canvas.getBoundingClientRect();
    var x = e.clientX - rectangle.left;
    var y = e.clientY - rectangle.top;
    if (x < 0 || x > 800 || y < 0 || y > 400) {
        done(e);
        wasoutside = true;
        return true;
    }

    // extra check if there's a selection
    if (selected.length > 0) {
        var xmin = selected[0];
        var xmax = selected[0] + selected[2];
        var ymin = selected[1];
        var ymax = selected[1] + selected[3];

        if (x < xmin || x > xmax || y < ymin || y > ymax) {
            return true;
        }
    }
}

function moved(e) {
    if (drawing && !outside(e)) {
        var rectangle = canvas.getBoundingClientRect();
        var x = e.clientX - rectangle.left;
        var y = e.clientY - rectangle.top;
        if (wasoutside) {
            done();
            ctx.moveTo(x, y);
            ctx.beginPath();
            wasoutside = false;
        }
        else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        // add coordinates to array
        if (timer % 2 == 0) {
            coordinates.push([x, y]);
        }
        timer++;
    }
}

function done(e) {
    ctx.closePath();
    ctx.fill();
    drawing = false;
    if (coordinates.length != prevlen) {
        mirror();
        updatecoords();

        if (coordinates2.length > 0) {
            createpointcloud();
        }
    }

    prevlen = coordinates.length;
}

function updatecoords() {
    var pixel;
    var zmin = 0;
    var zmax = 100;
    var ymin = 0;
    var ymax = 50;
    var xmin = 0;
    var xmax = 100;

    if (selected.length > 0) {
        var xmin = Math.floor(selected[0]/8);
        var xmax = Math.floor((selected[0] + selected[2])/8);
        var ymin = Math.floor(selected[1]/8);
        var ymax = Math.floor((selected[1] + selected[3])/8);
    }

    if (sculptselected.length > 0) {
        var zmin = Math.floor(sculptselected[0]/8);
        var zmax = Math.floor((sculptselected[0] + sculptselected[2])/8);

        if (selected.length > 0) {
            if (sculptselected[1] < selected[1]) {
                ymin = Math.floor(sculptselected[1]/8);
            }
            if (sculptselected[1] + sculptselected[3] < selected[1] + selected[3]) {
                ymax = Math.floor((sculptselected[1] + sculptselected[3])/8);
            }
        }
        else {
            ymin = Math.floor(sculptselected[1]/8);
            ymax = Math.floor((sculptselected[1] + sculptselected[3])/8);
        }
    }

    console.log("first " + xmin + " " + xmax + " " + ymin + " " + ymax + " " + zmin + " " + zmax);
    for (var i = xmin + 1; i < xmax; i++) {
        for (var j = ymin + 1; j < ymax; j++) {
            pixel = ctx.getImageData(i*8, j*8, 1, 1);

            if (pixel.data[0] != 0 || pixel.data[1] != 0 || pixel.data[2] != 0 || pixel.data[3] != 0) {
                for (var k = zmin + 1; k < zmax; k++) {
                    allcoords[i][j][k] += 5;
                }
            }
        }
    }
}

function selectclicked(e) {
    canvas.style.cursor = "crosshair";
    selected = [];
    selecting = true;

    // clear prev selections
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(coordinates[0][0], coordinates[0][1]);
    ctx.beginPath();
    for (var i = 1; i < coordinates.length; i++) {
        ctx.lineTo(coordinates[i][0], coordinates[i][1]);
        ctx.stroke();
    }
    ctx.closePath();
    ctx.fill();

    var rectangle = selectlayer.getBoundingClientRect();
    var x = e.clientX - rectangle.left;
    var y = e.clientY - rectangle.top;
    selected.push(x, y);
    select.beginPath();
}

function selectmoved(e) {
    if (selecting) {
        var rectangle = selectlayer.getBoundingClientRect();
        if (selected.length > 2) {
            selected.pop();
            selected.pop();
        }
        var width = e.clientX - rectangle.left - selected[0];
        var height = e.clientY - rectangle.top - selected[1];
        selected.push(width, height);
        select.clearRect(0, 0, selectlayer.width, selectlayer.height);
        select.strokeRect(selected[0], selected[1], width, height);
    }
}

function selectdone(e) {
    ctx.strokeRect(selected[0], selected[1], selected[2], selected[3]);
    canvas.style.cursor = "auto";
    selecting = false;
    // modify();
    select.closePath();
}


initialize();
// mouse clicks will draw points
canvas.addEventListener("pointerdown", clicked);
canvas.addEventListener("pointermove", moved);
canvas.addEventListener("pointerup", done);