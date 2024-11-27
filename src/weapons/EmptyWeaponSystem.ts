import { Weapon } from "./Weapon";

export class EmptyWeaponSystem implements Weapon {
  fire(): void {
    /* Does Nothing */
  }
}
