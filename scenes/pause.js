class pauseGame extends Phaser.Scene {
  constructor() {
    super("pauseGame");
  }
  preload() {

  }
  create() {
    var text = "Swipe up: rotate piece\nSwipe down: hard drop\nTap: soft drop\nSwipe left/right: move piece."
    this.instructions = this.add.bitmapText(50, 200, 'topaz', text, 40).setOrigin(0, .5).setTint(0xffffff).setInteractive();

    this.exitText = this.add.bitmapText(game.config.width / 2, 1200, 'topaz', 'UNPAUSE', 70).setOrigin(.5, .5).setTint(0xffffff).setInteractive();

    this.exitText.on('pointerdown', function () {
      isPaused = false;
      this.scene.sleep();

      this.scene.resume("PlayGame");
    }, this);

  }
}