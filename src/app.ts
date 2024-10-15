import { Game, Scene } from "phaser";

class MainScene extends Scene {
  private player: Phaser.GameObjects.Polygon;

  constructor() {
    super("GameScene");
  }

  create() {
    const playerVertices = [
      [0, 0],
      [40, 10],
      [0, 20],
    ];

    this.player = this.add.polygon(
      100,
      400,
      playerVertices,
      Phaser.Display.Color.GetColor(110, 110, 110),
    );

    this.matter.add.gameObject(this.player);
  }
}

class Inferno2DGame extends Game {
  constructor() {
    super({
      type: Phaser.CANVAS,
      parent: "game",
      width: 800,
      height: 600,
      scene: [MainScene],
      physics: {
        default: "matter",
        matter: {
          debug: true,
          gravity: { x: 0, y: 0 },
        },
      },
    });
  }
}

new Inferno2DGame();
