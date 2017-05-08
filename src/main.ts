import * as PIXI from "pixi.js";

if (!PIXI.utils.isWebGLSupported()) {
  alert("Your browser don't support WebGL, it may be slow !");
}

const renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
renderer.autoResize = true;

window.onresize = () => {
  renderer.resize(window.innerWidth, window.innerHeight);
};

document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

renderer.render(stage);

let start = () => {
  let sprite = new PIXI.Sprite(
    PIXI.loader.resources["sprites/wood.jpg"].texture
  );
  stage.addChild(sprite);
  renderer.render(stage);
};

PIXI.loader.add("sprites/wood.jpg").load(start);
