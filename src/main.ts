import * as PIXI from "pixi.js";

export class Application extends PIXI.Application {
  constructor() {
    const noWebGL = !PIXI.utils.isWebGLSupported();

    super(0, 0, {
      antialias: true,
      autoResize: true,
      view: <HTMLCanvasElement> document.getElementById("application")
    }, noWebGL); 

    if (noWebGL) {
      alert("Your browser don't support WebGL, it may be slow !");
    }

    let loader = new PIXI.loaders.Loader("./sprites");
    loader.add("wood.jpg");
    loader.load(() => {
      let wood = PIXI.Sprite.fromFrame("wood.jpg");
      wood.name = "wood";
      this.stage.addChild(wood);

      this.start();
      this.resize();
    });
  }

  private resize(): void {
    this.renderer.resize(window.innerWidth, window.innerHeight);

    this.stage.width = this.renderer.width;
    this.stage.height = this.renderer.height;

    this.stage.scale.set(1, 1);
  }
}

new Application();
