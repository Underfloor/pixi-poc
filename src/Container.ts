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
  if (this.parent.calculateBounds !== undefined && this.transform.position !== undefined) {
    const x = this.transform.position.x;
    const y = this.transform.position.y;

    const sx = this.transform.scale.x;
    const sy = this.transform.scale.y;

    const transform = new PIXI.Transform();
    transform.setFromMatrix(this.worldTransform);
    transform.updateTransform(this.parent.transform);

    const parentTransform = new PIXI.Transform();
    parentTransform.setFromMatrix(this.parent.worldTransform);

    let parentBounds = this.parent.getBounds(true);

    if (this.parent.resize === Resize.FITCONTAIN && this.parent.parent !== undefined) {
      if (this.parent.parent.viewport !== undefined) {
        parentBounds.width = this.parent.parent.viewport.width;
        parentBounds.height = this.parent.parent.viewport.height;
      } else {
        if (this.parent.parent._width !== undefined) {
          parentBounds.width = this.parent.parent._width;
        }
        if (this.parent.parent._height !== undefined) {
          parentBounds.height = this.parent.parent._height;
        }
      }
    } else if (this.parent.viewport !== undefined) {
      parentBounds.width = this.parent.viewport.width * parentTransform.scale.x;
      parentBounds.height = this.parent.viewport.height * parentTransform.scale.y;
    } else {
      if (this.parent._width !== undefined) {
        parentBounds.width = this.parent._width;
      }
      if (this.parent._height !== undefined) {
        parentBounds.height = this.parent._height;
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
      } else if (this.resize === Resize.CONTAIN || this.resize === Resize.FITCONTAIN) {
        ratio = Math.min(parentBounds.width / width * transform.scale.x, parentBounds.height / height * transform.scale.y);
      }

      if (!isNaN(ratio)) {
        this.transform.scale.set(ratio, ratio);
      }
    }

    if (this.dock !== undefined) {
      if (this.dock & Dock.CENTER_HORIZONTAL) {
        this.transform.position.x = ((parentBounds.width - (width / (this.pivot.x || 1))) / 2 + this.x * transform.scale.x) / parentTransform.scale.x;
      } else if (this.dock & Dock.RIGHT) {
        this.transform.position.x = (parentBounds.width - width / (this.pivot.x || 1) - this.x * transform.scale.x) / parentTransform.scale.x;
      }

      if (this.dock & Dock.CENTER_VERTICAL) {
        this.transform.position.y = ((parentBounds.height - (height / (this.pivot.y || 1))) / 2 + this.y * transform.scale.y) / parentTransform.scale.y;
      } else if (this.dock & Dock.BOTTOM) {
        this.transform.position.y = (parentBounds.height - height / (this.pivot.y || 1) - this.y * transform.scale.y) / parentTransform.scale.y;
      }
    }

    baseUpdateTransform.call(this);

    this.transform.position.x = x;
    this.transform.position.y = y;

    this.transform.scale.x = sx;
    this.transform.scale.y = sy;
  } else if (this.parent.calculateBounds !== undefined) {
    baseUpdateTransform.call(this);
  }
}
