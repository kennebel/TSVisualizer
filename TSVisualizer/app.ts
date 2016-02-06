/// <reference path="Root/Root.ts" />

var root: Root;
var settings: IRootOptions = {};
window.onload = () => {
    root = new Root(settings);
    animateScene();
};

window.onresize = (event) => {
    root.windowResize();
}

document.addEventListener("keydown", (event) => { /*console.log(event);*/ root.inpMgr.keyPressed(event) });
document.addEventListener("keyup", (event) => { /*console.log(event);*/ root.inpMgr.keyReleased(event) });

function animateScene() {
    root.animateScene();
    requestAnimationFrame(animateScene);
}
