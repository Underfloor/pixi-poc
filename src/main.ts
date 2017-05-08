import * as PIXI from "pixi.js";

import Container from "./Container";
import {Resize} from "./ResizeType";

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

    this.stage.name = "stage";

    let loader = new PIXI.loaders.Loader("./sprites");
    loader.add("cover.jpg");
    loader.add("wood.jpg");
    loader.load(() => {
      let coverContainer = new Container();
      coverContainer.name = "coverContainer";
      coverContainer.resize = Resize.COVER;
      this.stage.addChild(coverContainer);

      let cover = PIXI.Sprite.fromFrame("cover.jpg");
      cover.name = "cover";
      coverContainer.addChild(cover);

      let containContainer = new Container();
      containContainer.name = "containContainer";
      containContainer.resize = Resize.CONTAIN;
      this.stage.addChild(containContainer);

      let wood = PIXI.Sprite.fromFrame("wood.jpg");
      wood.name = "wood";
      containContainer.addChild(wood);

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
