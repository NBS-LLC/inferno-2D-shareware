import { Game } from "phaser";
import { MainScene } from "./scenes/MainScene";

import GameConfig = Phaser.Types.Core.GameConfig;

const config: GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: [MainScene],
};

new Game(config);
