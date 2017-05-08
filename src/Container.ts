import * as PIXI from "pixi.js";

import {Resize} from "./ResizeType";
import Viewport from "./Viewport";

export default class Container extends PIXI.Container {
  public resize: Resize;
  public viewport: Viewport;

  public _width: number;
  public _height: number;

  public updateTransform(): void {
    if (this.parent.calculateBounds !== undefined) {
      let oldTransform = <PIXI.Transform>this.transform;

      const x = oldTransform.position.x;
      const y = oldTransform.position.y;

      const sx = oldTransform.scale.x;
      const sy = oldTransform.scale.y;

      const parent = <Container>this.parent;

      const transform = new PIXI.Transform();
      transform.setFromMatrix(this.worldTransform);
      transform.updateTransform(parent.transform);

      const parentTransform = new PIXI.Transform();
      parentTransform.setFromMatrix(parent.worldTransform);

      let parentBounds = parent.getBounds(true);

      if (parent.viewport !== undefined) {
        parentBounds.width = parent.viewport.width * parentTransform.scale.x;
        parentBounds.height = parent.viewport.height * parentTransform.scale.y;
      } else {
        if (parent._width !== undefined) {
          parentBounds.width = parent._width;
        }
        if (parent._height !== undefined) {
          parentBounds.height = parent._height;
        }
      }

      let width: number;
      let height: number;

      if (this.viewport !== undefined) {
        width = this.viewport.width * transform.scale.x;
        height = this.viewport.height * transform.scale.y;
      } else {
        width = this.width;
        height = this.height;
      }

      if (this instanceof PIXI.Sprite) {
        width *= transform.scale.x;
        height *= transform.scale.y;
      }

      if (this.resize) {
        let ratio: number;
        if (this.resize === Resize.COVER) {
          ratio = Math.max(parentBounds.width / this.width, parentBounds.height / this.height);
        } else if (this.resize === Resize.CONTAIN) {
          ratio = Math.min(parentBounds.width / this.width, parentBounds.height / this.height);
        }

        if (!isNaN(ratio)) {
          oldTransform.scale.set(ratio, ratio);
        }
      }

      super.updateTransform();

      oldTransform.position.x = x;
      oldTransform.position.y = y;

      oldTransform.scale.x = sx;
      oldTransform.scale.y = sy;
    }
  }
}
