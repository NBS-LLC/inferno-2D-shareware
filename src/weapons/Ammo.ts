import { GameObjects } from "phaser";

export interface Ammo {
  firedBy(gameObject: GameObjects.GameObject): void;
}
