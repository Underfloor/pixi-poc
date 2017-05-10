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
      deps: ["pixi-spine", "gsap"]
    }
  },
  paths: {
    "pixi": "./node_modules/pixi.js/dist/pixi.min",
    "pixi-spine": "./node_modules/pixi-spine/bin/pixi-spine",
    "TweenMax": "./node_modules/gsap/TweenMax",
    "TweenLite": "./node_modules/gsap/TweenLite",
    "TimelineMax": "./node_modules/gsap/TimelineMax",
    "TimelineLite": "./node_modules/gsap/TimelineLite",
    "EasePack": "./node_modules/gsap/EasePack"
  }
});

var GreenSockAMDPath = "greensock";

define("gsap", ["TweenMax", "TimelineMax", "EasePack"], () => {
  return window;
});

requirejs(["dist/main"], (Main) => {});
