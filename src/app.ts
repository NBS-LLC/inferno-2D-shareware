import { Game } from "phaser";
import { MainScene } from "./scenes/MainScene";

class Inferno2DGame extends Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "matter",
        matter: {
          debug: false,
          gravity: { x: 0, y: 0 },
        },
      },
      scene: [MainScene],
    });
  }
}

new Inferno2DGame();
