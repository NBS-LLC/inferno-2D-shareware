import { Scene } from "phaser";
import { Enemy } from "../Enemy";
import { Player } from "../Player";

import Key = Phaser.Input.Keyboard.Key;
import Text = Phaser.GameObjects.Text;

export class MainScene extends Scene {
  private debugging = false;
  private fpsText: Text;
  private pointerText: Text;

  private player: Player;
  private playerInput: { [key: string]: Key } = {};
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

    this.player = Player.createDefault(this);

    this.enemy = Enemy.createDefault(this, 700, 400);
    this.enemy.faceLeft();

    this.playerInput["right"] = this.input.keyboard.addKey("RIGHT");
    this.playerInput["left"] = this.input.keyboard.addKey("LEFT");
    this.playerInput["up"] = this.input.keyboard.addKey("UP");
    this.playerInput["down"] = this.input.keyboard.addKey("DOWN");
    this.playerInput["face-left"] = this.input.keyboard.addKey("A");
    this.playerInput["face-right"] = this.input.keyboard.addKey("D");
    this.playerInput["fire-primary"] = this.input.keyboard.addKey("SPACE");

    this.fpsText = this.add.text(16, 32, "", {
      fontSize: "16px",
      color: "#FFF",
    });

    this.pointerText = this.add.text(16, 48, "", {
      fontSize: "16px",
      color: "#FFF",
    });
  }

  update() {
    this.player.stopMoving();

    if (this.playerInput["right"].isDown) {
      this.player.moveRight();
    }

    if (this.playerInput["left"].isDown) {
      this.player.moveLeft();
    }

    if (this.playerInput["up"].isDown) {
      this.player.moveUp();
    }

    if (this.playerInput["down"].isDown) {
      this.player.moveDown();
    }

    if (this.playerInput["face-left"].isDown) {
      this.player.faceLeft();
    }

    if (this.playerInput["face-right"].isDown) {
      this.player.faceRight();
    }

    if (this.playerInput["fire-primary"].isDown) {
      this.player.firePrimaryWeapon();
    }

    this.fpsText.setText(this.debugging ? this.getFPSDetails() : "");
    this.pointerText.setText(this.debugging ? this.getPointerDetails() : "");
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
