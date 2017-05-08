import * as PIXI from "pixi.js";

import Viewport from "./Viewport";

import {Resize} from "./ResizeType";
import {Dock} from "./DoctState";

declare module "pixi.js" {
  export interface Container {
    resize: Resize;
    viewport: Viewport;
    dock: Dock;
  }
}

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

    if (this.resize !== undefined) {
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

    if (this.dock !== undefined) {
      if (this.dock & Dock.CENTER_HORIZONTAL) {
        this.transform.position.x = ((parentBounds.width - width / (this.pivot.x || 1)) / 2 + this.x * transform.scale.x) / parentTransform.scale.x;
      } else if (this.dock & Dock.RIGHT) {
        this.transform.position.x = (parentBounds.width - width / (this.pivot.x || 1) - this.x * transform.scale.x) / parentTransform.scale.x;
      }

      if (this.dock & Dock.CENTER_VERTICAL) {
        this.transform.position.y = ((parentBounds.height - height / (this.pivot.y || 1)) / 2 + this.y * transform.scale.y) / parentTransform.scale.y;
      } else if (this.dock & Dock.BOTTOM) {
        this.transform.position.y = (parentBounds.height - height / (this.pivot.y || 1) - this.y * transform.scale.y) / parentTransform.scale.y;
      }
    }

    baseUpdateTransform.call(this);

    oldTransform.position.x = x;
    oldTransform.position.y = y;

    oldTransform.scale.x = sx;
    oldTransform.scale.y = sy;
  }
}
