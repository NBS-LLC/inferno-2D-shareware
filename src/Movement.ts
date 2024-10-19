export abstract class Movement {
  abstract getBody(): MatterJS.BodyType;

  stopMoving() {
    this.getMatter().setVelocity(this.getBody(), 0, 0);
  }

  moveUp() {
    this.getMatter().setVelocityY(this.getBody(), -5);
  }

  moveDown() {
    this.getMatter().setVelocityY(this.getBody(), 5);
  }

  moveLeft() {
    this.getMatter().setVelocityX(this.getBody(), -5);
  }

  moveRight() {
    this.getMatter().setVelocityX(this.getBody(), 5);
  }

  private getMatter() {
    return this.getBody().gameObject.scene.matter;
  }
}
