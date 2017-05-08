import * as PIXI from "pixi.js";

import {Resize} from "./ResizeType";
import Viewport from "./Viewport";

const baseUpdateTransform = PIXI.Container.prototype.updateTransform;

export const updateTransform = function(): void {
  if (this.parent.calculateBounds !== undefined) {
    let oldTransform = <PIXI.Transform>this.transform;

    const x = oldTransform.position.x;
    const y = oldTransform.position.y;

    const sx = oldTransform.scale.x;
    const sy = oldTransform.scale.y;

    const parent = this.parent;

    const transform = new PIXI.Transform();
    transform.setFromMatrix(this.worldTransform);
    transform.updateTransform(parent.transform);

    const parentTransform = new PIXI.Transform();
    parentTransform.setFromMatrix(parent.worldTransform);

    let parentBounds = parent.getBounds(true);

    if (parent.viewport !== undefined) {
      parentBounds.width = parent.viewport.width;
      parentBounds.height = parent.viewport.height;
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
        ratio = Math.max(parentBounds.width / width * transform.scale.x, parentBounds.height / height * transform.scale.y);
      } else if (this.resize === Resize.CONTAIN) {
        ratio = Math.min(parentBounds.width / width * transform.scale.x, parentBounds.height / height * transform.scale.y);
      }

      if (!isNaN(ratio)) {
        oldTransform.scale.set(ratio, ratio);
      }
    }

    baseUpdateTransform.call(this);

    oldTransform.position.x = x;
    oldTransform.position.y = y;

    oldTransform.scale.x = sx;
    oldTransform.scale.y = sy;
  }
}
