import { Game, Scene } from "phaser";

class MainScene extends Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private player: Phaser.GameObjects.GameObject;
  private enemy: Phaser.GameObjects.GameObject;

  constructor() {
    super("GameScene");
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // Player

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

    // TODO: make the body boundary match the shape (triangle)
    this.matter.add.gameObject(this.player);

    // Enemy

    const enemyVertices = [
      [0, 0],
      [40, 0],
      [40, 20],
      [0, 20],
    ];

    this.enemy = this.add.polygon(
      700,
      400,
      enemyVertices,
      Phaser.Display.Color.GetColor(200, 110, 110),
    );

    this.matter.add.gameObject(this.enemy);
  }

  update(_time: number, _delta: number): void {
    const speed = 5;

    this.matter.setVelocity(this.player.body as MatterJS.BodyType, 0, 0);

    if (this.cursors.left.isDown) {
      this.matter.setVelocityX(this.player.body as MatterJS.BodyType, -speed);
    } else if (this.cursors.right.isDown) {
      this.matter.setVelocityX(this.player.body as MatterJS.BodyType, speed);
    }

    if (this.cursors.up.isDown) {
      this.matter.setVelocityY(this.player.body as MatterJS.BodyType, -speed);
    } else if (this.cursors.down.isDown) {
      this.matter.setVelocityY(this.player.body as MatterJS.BodyType, speed);
    }
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
