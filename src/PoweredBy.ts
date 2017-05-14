import * as PIXI from "pixi.js";

import {TweenMax, Circ} from "gsap";

import Viewport from "./Viewport";

import {Dock} from "./DockState";
import {Resize} from "./ResizeType";

export default class PoweredBy extends PIXI.Container {
  private background: PIXI.Graphics;

  private firstTriangle: PIXI.Graphics;

  constructor() {
    super();

    this.visible = false;

    this.resize = Resize.FITCONTAIN;
    this.viewport = new Viewport(1024, 256);

    this.background = new PIXI.Graphics();
    this.addChild(this.background);

    this.firstTriangle = new PIXI.Graphics();
    this.firstTriangle.beginFill(0x0094ff);
    this.firstTriangle.drawPolygon([
      0, 0,
      150, 0,
      110, 130,
      0, 0
    ]);
    this.firstTriangle.endFill();
    this.firstTriangle.dock = Dock.RIGHT;
    this.firstTriangle.x = 140;
    this.addChild(this.firstTriangle);

    this.resizeUpdate = () => {
      this.background.beginFill(0xFFFFFF);
      this.background.drawRect(0, 0, this.refWidth, this.refHeight);
      this.background.endFill();
    };
  }

  public start(callBack: () => void): void {
    this.alpha = 0;
    this.visible = true;
    TweenMax.fromTo(this, 2, {
      alpha: 0
    }, {
      alpha: 1,
      ease: Circ.easeIn,
      onComplete: () => {
        TweenMax.fromTo(this.firstTriangle, 2.5, {
          x: 140
        }, {
          x: 0,
          onUpdate: () => {
            this.firstTriangle.clear();
            this.firstTriangle.beginFill(0x0094ff);
            this.firstTriangle.drawPolygon([
              0, 0,
              150, 0,
              this.firstTriangle.x / 2 + 50, 130,
              0, 0
            ]);
            this.firstTriangle.endFill();
          },
          onComplete: () => {
            callBack();
          }
        });
      }
    });
  }
}
