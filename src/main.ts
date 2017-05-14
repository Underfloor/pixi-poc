///<reference path="../node_modules/pixi-spine/bin/pixi-spine.d.ts" />

import * as PIXI from "pixi.js";
import {TweenMax, Circ} from "gsap";

import Viewport from "./Viewport";
import PoweredBy from "./PoweredBy";

import {Resize} from "./ResizeType";
import {updateTransform, refWidth, refHeight} from "./Container";
import {Dock} from "./DockState";

export class Application extends PIXI.Application {
  constructor() {
    const noWebGL = !PIXI.utils.isWebGLSupported();

    super(0, 0, {
      antialias: true,
      autoResize: true,
      backgroundColor: 0x000000
    }, noWebGL); 

    document.getElementById("nounouView").appendChild(this.view);

    if (noWebGL) {
      alert("Your browser don't support WebGL, it may be slow !");
    }

    PIXI.Container.prototype.updateTransform = updateTransform;
    Object.defineProperty(PIXI.Container.prototype, "refWidth", {
      get: refWidth
    });
    Object.defineProperty(PIXI.Container.prototype, "refHeight", {
      get: refHeight
    });

    this.stage.name = "stage";

    PIXI.loader.baseUrl = "./sprites";
    PIXI.loader.add("blue.jpg")
      .add("cover.jpg")
      .add("wood.jpg")
      .add("touhou4dead2.jpg")
      .add("spineboy", "spineboy.json")
      .add("ArrowUp.png")
      .load((loader: PIXI.loaders.Loader, res: any) => {
        this.start();
        this.resize();

        window.addEventListener("resize", () => this.resize());

        this.launchPoweredBy(() => {
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
          containContainer.pivot.set(512, 512);
          this.stage.addChild(containContainer);

          let coverAtMask = PIXI.Sprite.fromFrame("cover.jpg");
          coverAtMask.name = "coverAtMask";
          containContainer.addChild(coverAtMask);

          //containContainer.mask = coverAtMask;

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
                return fitContainContainer.refWidth
              },
              y: 0
            }, <any>{
              ease: Circ.easeInOut,
              x: -wood.width,
              y: () => {
                return fitContainContainer.refHeight
              },
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

          let arrow = PIXI.Sprite.fromFrame("ArrowUp.png");
          arrow.name = "arrow";
          arrow.dock = Dock.CENTER_ALL;
          fitContainContainer.addChild(arrow);

          arrow.interactive = true;
          arrow.once("click", () => {
            this.view.requestPointerLock();
            this.stage.interactive = true;
            this.stage.on("mousemove", (event: PIXI.interaction.InteractionEvent) => {
              containContainer.rotation += 0.001;
            });
          });

          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              if (Math.random() < 0.7) {
                let sprite = PIXI.Sprite.fromFrame("wood.jpg");
                sprite.x = -512 + (i * 256);
                sprite.y = -512 + (j * 256);
                containContainer.addChild(sprite);
              }
            }
          }
        });
      });
  }

  private resize(): void {
    this.renderer.resize(window.innerWidth, window.innerHeight);

    this.stage.width = this.renderer.width;
    this.stage.height = this.renderer.height;

    this.stage.scale.set(1, 1);
  }

  public launchPoweredBy(callBack: () => void): void {
    let poweredBy = new PoweredBy();
    this.stage.addChild(poweredBy);

    poweredBy.start(() => {
      this.stage.removeChild(poweredBy);
      callBack();
    });
  }
}

new Application();
