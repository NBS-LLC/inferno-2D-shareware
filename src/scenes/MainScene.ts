import { Scene } from "phaser";
import { Enemy } from "../game-objects/Enemy";
import { Player, PlayerInput } from "../game-objects/Player";

export class MainScene extends Scene {
  private debugging = false;
  private fpsText: Phaser.GameObjects.Text;
  private pointerText: Phaser.GameObjects.Text;

  private player: Player;
  private enemy: Enemy;

  constructor() {
    super("MainScene");
  }

  init() {
    this.input.keyboard.addKey("esc").on("down", () => {
      this.handleRestart();
    });

    this.input.keyboard
      .addKey("backtick")
      .on("down", () => (this.debugging = !this.debugging));
  }

  create() {
    const background = this.add.graphics();
    const bgGradient = this.getDayGradient();
    background.fillGradientStyle(
      bgGradient[0],
      bgGradient[1],
      bgGradient[2],
      bgGradient[3],
      1,
    );
    background.fillRect(0, 0, 800, 600);

    const playerInput: PlayerInput = {};
    playerInput["right"] = this.input.keyboard.addKey("RIGHT");
    playerInput["left"] = this.input.keyboard.addKey("LEFT");
    playerInput["up"] = this.input.keyboard.addKey("UP");
    playerInput["down"] = this.input.keyboard.addKey("DOWN");
    playerInput["face-left"] = this.input.keyboard.addKey("A");
    playerInput["face-right"] = this.input.keyboard.addKey("D");
    playerInput["fire-primary"] = this.input.keyboard.addKey("SPACE");

    this.player = new Player(this, 100, 400, playerInput);

    this.enemy = new Enemy(this, 700, 400);
    this.enemy.idle();
    this.enemy.faceLeft();

    this.fpsText = this.add.text(16, 32, "", {
      fontSize: "16px",
      color: "#FFF",
    });

    this.pointerText = this.add.text(16, 48, "", {
      fontSize: "16px",
      color: "#FFF",
    });
  }

  update(time: number, delta: number) {
    this.fpsText.setText(this.debugging ? this.getFPSDetails() : "");
    this.pointerText.setText(this.debugging ? this.getPointerDetails() : "");

    this.player.update(time, delta);
    this.enemy.update(time, delta);
  }

  private handleRestart() {
    this.debugging = false;
    this.scene.restart();
  }

  private getDayGradient(): number[] {
    return [0x0288d1, 0x288d1, 0xacf0f2, 0xacf0f2];
  }

  private getFPSDetails(): string {
    return "FPS: " + this.game.loop.actualFps.toFixed(2);
  }

  private getPointerDetails(): string[] {
    const pointer = this.input.activePointer;
    return ["x: " + pointer.x, "y: " + pointer.y];
  }
}
