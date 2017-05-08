require.config({
  map: {
    "*": {
      "pixi.js": "pixi"
    }
  },
  paths: {
    "pixi": "./node_modules/pixi.js/dist/pixi.min"
  }
});

requirejs(["dist/main"], (Main) => {});
