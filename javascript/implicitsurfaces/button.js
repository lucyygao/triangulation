// change the text on the buttons and switch to appropriate event listeners
function changebuttons() {
    if (document.getElementById('button').innerHTML == "SELECT") {
        canvas.removeEventListener("pointerdown", clicked);
        canvas.removeEventListener("pointermove", moved);
        canvas.removeEventListener("pointerup", done);
        canvas2.removeEventListener("pointerdown", sculptclicked);
        canvas2.removeEventListener("pointermove", sculptmoved);
        canvas2.removeEventListener("pointerup", sculptdone);

        canvas.addEventListener("pointerdown", selectclicked);
        canvas.addEventListener("pointermove", selectmoved);
        canvas.addEventListener("pointerup", selectdone);
        canvas2.addEventListener("pointerdown", selectsculptclicked);
        canvas2.addEventListener("pointermove", selectsculptmoved);
        canvas2.addEventListener("pointerup", selectsculptdone);
        document.getElementById('button').innerHTML = "DRAW";
        document.getElementById('button2').innerHTML = "DRAW";
    }
    else {
        canvas.removeEventListener("pointerdown", selectclicked);
        canvas.removeEventListener("pointermove", selectmoved);
        canvas.removeEventListener("pointerup", selectdone);
        canvas2.removeEventListener("pointerdown", selectsculptclicked);
        canvas2.removeEventListener("pointermove", selectsculptmoved);
        canvas2.removeEventListener("pointerup", selectsculptdone);

        canvas.addEventListener("pointerdown", clicked);
        canvas.addEventListener("pointermove", moved);
        canvas.addEventListener("pointerup", done);
        canvas2.addEventListener("pointerdown", sculptclicked);
        canvas2.addEventListener("pointermove", sculptmoved);
        canvas2.addEventListener("pointerup", sculptdone);
        document.getElementById('button').innerHTML = "SELECT";
        document.getElementById('button2').innerHTML = "SELECT";
    }
}

// not complete
function undo() {

}

function redo() {

}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
