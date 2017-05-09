require.config({
  map: {
    "*": {
      "pixi.js": "pixi"
    }
  },
  shim: {
    "pixi-spine": {
      deps: ["pixi"],
      init: (PIXI) => {
        return PIXI;
      }
    },
    "dist/main": {
      deps: ["pixi-spine"]
    }
  },
  paths: {
    "pixi": "./node_modules/pixi.js/dist/pixi.min",
    "pixi-spine": "./node_modules/pixi-spine/bin/pixi-spine"
  }
});

requirejs(["dist/main"], (Main) => {});
