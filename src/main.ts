///<reference path="../node_modules/pixi-spine/bin/pixi-spine.d.ts" />

import * as PIXI from "pixi.js";
import {TweenMax, Power0} from "gsap";

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

    PIXI.loader.baseUrl = "./sprites";
    PIXI.loader.add("blue.jpg")
      .add("cover.jpg")
      .add("wood.jpg")
      .add("touhou4dead2.jpg")
      .add("spineboy", "spineboy.json")
      .load((loader: PIXI.loaders.Loader, res: any) => {
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

        let fitContainContainer = new PIXI.Container();
        fitContainContainer.name = "fitContainContainer";
        fitContainContainer.resize = Resize.FITCONTAIN;
        fitContainContainer.viewport = new Viewport(768, 768);
        this.stage.addChild(fitContainContainer);

        let wood = PIXI.Sprite.fromFrame("wood.jpg");
        wood.name = "wood";
        wood.dock = Dock.BOTTOM;
        wood.x = fitContainContainer.width;
        fitContainContainer.addChild(wood);

        let woodWalk = () => {
          TweenMax.fromTo(wood, 2, <any>{
            x: () => {
              return fitContainContainer.width
            }
          }, <any>{
            ease: Power0.easeNone,
            x: -wood.width,
            onComplete: () => woodWalk()
          });
        };

        woodWalk();

        let spineBoy = new PIXI.spine.Spine(res.spineboy.spineData);
        spineBoy.name = "spineBoy";
        spineBoy.dock = Dock.CENTER_HORIZONTAL | Dock.BOTTOM;
        spineBoy.y = wood.height;
        spineBoy.viewport = new Viewport(1, 1);
        spineBoy.state.setAnimation(0, "walk", true);
        fitContainContainer.addChild(spineBoy);

        let wood2 = PIXI.Sprite.fromFrame("wood.jpg");
        wood2.name = "wood2";
        wood2.dock = Dock.CENTER_VERTICAL | Dock.RIGHT;
        fitContainContainer.addChild(wood2);

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
