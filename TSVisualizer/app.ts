/// <reference path="TS/Root/Root.ts" />

var root: Root;
var settings: IRootOptions = {};
window.onload = () => {
    root = new Root(settings);
    animateScene();

    setInterval(() => root.updateFromSource(), 500);
};

window.onresize = (event) => {
    root.windowResize();
}

document.addEventListener("keydown", (event) => { /*console.log(event);*/ root.inpMgr.keyPressed(event); });
document.addEventListener("keyup", (event) => { /*console.log(event);*/ root.inpMgr.keyReleased(event); });
document.addEventListener("mousedown", (event) => { root.mouseDown(event); });
document.addEventListener("mouseup", (event) => { root.mouseUp(event); });
document.addEventListener("mousewheel", (event) => { console.log(event); root.mouseWheel(event); });

function animateScene() {
    root.animateScene();
    requestAnimationFrame(animateScene);
}
