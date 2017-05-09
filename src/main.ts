import * as PIXI from "pixi.js";

import Viewport from "./Viewport";

import {Resize} from "./ResizeType";
import {updateTransform} from "./Container";
import {Dock} from "./DoctState";

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

    PIXI.Container.prototype.updateTransform = updateTransform;

    this.stage.name = "stage";

    let loader = new PIXI.loaders.Loader("./sprites");
    loader.add("blue.jpg");
    loader.add("cover.jpg");
    loader.add("wood.jpg");
    loader.add("touhou4dead2.jpg");
    loader.load(() => {
      let coverContainer = new PIXI.Container();
      coverContainer.name = "coverContainer";
      coverContainer.dock = Dock.CENTER_ALL;
      coverContainer.resize = Resize.COVER;
      this.stage.addChild(coverContainer);

      let blue = PIXI.Sprite.fromFrame("blue.jpg");
      blue.name = "blue";
      coverContainer.addChild(blue);

      let containContainer = new PIXI.Container();
      containContainer.name = "containContainer";
      containContainer.dock = Dock.CENTER_ALL;
      containContainer.resize = Resize.CONTAIN;
      containContainer.viewport = new Viewport(1024, 1024);
      this.stage.addChild(containContainer);

      let coverAtMask = PIXI.Sprite.fromFrame("cover.jpg");
      coverAtMask.name = "coverAtMask";
      containContainer.addChild(coverAtMask);

      containContainer.mask = coverAtMask;

      let touhou = PIXI.Sprite.fromFrame("touhou4dead2.jpg");
      touhou.name = "touhou";
      containContainer.addChild(touhou);

      let wood = PIXI.Sprite.fromFrame("wood.jpg");
      wood.name = "wood";
      wood.dock = Dock.CENTER_HORIZONTAL | Dock.BOTTOM;
      containContainer.addChild(wood);

      this.start();
      this.resize();

      window.addEventListener("resize", () => this.resize());
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
